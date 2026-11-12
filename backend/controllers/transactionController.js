// Ye file transactions (book issue/return) se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Book issue karo kisi member ko (Admin only, with DB transaction)
const issueBook = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { book_id, member_id, due_date } = req.body;

    if (!book_id || !member_id || !due_date) {
      return res.status(400).json({ error: 'Book, member, and due date are required' });
    }

    await client.query('BEGIN');

    // 1. Check member exists and is active
    const memberCheck = await client.query(
      'SELECT id, name, is_active FROM members WHERE id = $1',
      [member_id]
    );

    if (memberCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Member not found' });
    }

    if (!memberCheck.rows[0].is_active) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot issue book to an inactive member' });
    }

    // 2. Prevent issuing to a member with unpaid fines
    const fineCheck = await client.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
       FROM fines
       WHERE member_id = $1 AND status = 'unpaid'`,
      [member_id]
    );

    if (parseInt(fineCheck.rows[0].count, 10) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `Cannot issue book: Member has unpaid fines totaling ₹${fineCheck.rows[0].total}. Please clear fines first.`,
      });
    }

    // 3. Prevent issuing the same book twice to one member (currently issued and not yet returned)
    const existingIssue = await client.query(
      `SELECT id FROM transactions
       WHERE member_id = $1 AND book_id = $2 AND status = 'issued'`,
      [member_id, book_id]
    );

    if (existingIssue.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'This book is already issued to this member',
      });
    }

    // 4. Lock book row with SELECT ... FOR UPDATE
    const bookCheck = await client.query(
      'SELECT id, title, available_copies FROM books WHERE id = $1 FOR UPDATE',
      [book_id]
    );

    if (bookCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Book not found' });
    }

    if (bookCheck.rows[0].available_copies <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No copies available right now' });
    }

    // 5. Create transaction record
    const transactionResult = await client.query(
      `INSERT INTO transactions (book_id, member_id, due_date, status)
       VALUES ($1, $2, $3, 'issued') RETURNING *`,
      [book_id, member_id, due_date]
    );

    // 6. Decrement available copies
    await client.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
      [book_id]
    );

    // 7. If this member had an active reservation for this book, mark it fulfilled
    await client.query(
      `UPDATE reservations
       SET status = 'fulfilled'
       WHERE id = (
         SELECT id FROM reservations
         WHERE book_id = $1 AND member_id = $2 AND status = 'pending'
         ORDER BY id ASC LIMIT 1
       )`,
      [book_id, member_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Book issued successfully',
      transaction: transactionResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Function 2: Book return karo (with DB transaction & date-only math)
const returnBook = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // 1. Transaction dhundo aur lock karo
    const transactionCheck = await client.query(
      'SELECT *, (CURRENT_DATE - due_date) AS days_diff FROM transactions WHERE id = $1 FOR UPDATE',
      [id]
    );

    if (transactionCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactionCheck.rows[0];

    if (transaction.status === 'returned') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Book already returned' });
    }

    const book_id = transaction.book_id;

    // 2. Lock book row
    await client.query(
      'SELECT id, available_copies, total_copies FROM books WHERE id = $1 FOR UPDATE',
      [book_id]
    );

    // 3. Update transaction: return_date = CURRENT_DATE, status = 'returned'
    const result = await client.query(
      `UPDATE transactions
       SET return_date = CURRENT_DATE, status = 'returned'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // 4. Book available copies 1 badhao
    await client.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
      [book_id]
    );

    // 5. Date math: compare calendar dates, not timestamps!
    // Postgres (CURRENT_DATE - due_date) directly returns calendar day difference
    const diffDays = parseInt(transaction.days_diff, 10);
    const daysLate = diffDays > 0 ? diffDays : 0;

    let fineRecord = null;

    if (daysLate > 0) {
      const finePerDay = Number(process.env.FINE_PER_DAY) || 5;
      const fineAmount = daysLate * finePerDay;

      const fineResult = await client.query(
        `INSERT INTO fines (transaction_id, member_id, amount, days_late, status)
         VALUES ($1, $2, $3, $4, 'unpaid') RETURNING *`,
        [id, transaction.member_id, fineAmount, daysLate]
      );

      fineRecord = fineResult.rows[0];
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: fineRecord ? 'Book returned late, fine applied' : 'Book returned successfully',
      transaction: result.rows[0],
      fine: fineRecord,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Function 3: Transactions ki list bhejo (Admin sees all, members see only their own)
const getAllTransactions = async (req, res, next) => {
  try {
    let query = `
      SELECT t.id, t.book_id, t.member_id, t.issue_date, t.due_date, t.return_date, t.status,
             b.title AS book_title, b.author AS book_author,
             m.name AS member_name, m.email AS member_email
      FROM transactions t
      JOIN books b ON t.book_id = b.id
      JOIN members m ON t.member_id = m.id
    `;
    const params = [];

    // Agar user admin nahi hai, to sirf unke member_id ki transactions dikhao
    if (req.user.role !== 'admin') {
      if (!req.user.member_id) {
        return res.status(200).json([]);
      }
      query += ` WHERE t.member_id = $1`;
      params.push(req.user.member_id);
    }

    const { status } = req.query;
    if (status) {
      query += params.length > 0 ? ` AND t.status = $${params.length + 1}` : ` WHERE t.status = $1`;
      params.push(status);
    }

    query += ' ORDER BY t.id DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

module.exports = { issueBook, returnBook, getAllTransactions };
