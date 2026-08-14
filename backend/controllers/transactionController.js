// Ye file transactions (book issue/return) se related logic rakhti hai

const pool = require('../config/db');

// Function 1: Book issue karo kisi member ko
const issueBook = async (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;

    // Step A: Pehle check karo ki book available hai ya nahi
    const bookCheck = await pool.query(
      'SELECT available_copies FROM books WHERE id = $1',
      [book_id]
    );

    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (bookCheck.rows[0].available_copies <= 0) {
      return res.status(400).json({ error: 'No copies available right now' });
    }

    // Step B: Transaction record banao
    const transactionResult = await pool.query(
      `INSERT INTO transactions (book_id, member_id, due_date, status)
       VALUES ($1, $2, $3, 'issued') RETURNING *`,
      [book_id, member_id, due_date]
    );

    // Step C: Book ki available_copies 1 kam karo
    await pool.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
      [book_id]
    );

    res.status(201).json({
      message: 'Book issued successfully',
      transaction: transactionResult.rows[0],
    });
  } catch (error) {
    console.error('Error issuing book:', error.message);
    res.status(500).json({ error: 'Server error, could not issue book' });
  }
};

// Function 2: Book return karo (aur agar late hai to fine lagao)
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Step A: Transaction dhundo
    const transactionCheck = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (transactionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transactionCheck.rows[0].status === 'returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }

    const transaction = transactionCheck.rows[0];
    const book_id = transaction.book_id;

    // Step B: Transaction update karo - return_date aaj ki date set karo
    const result = await pool.query(
      `UPDATE transactions
       SET return_date = CURRENT_DATE, status = 'returned'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // Step C: Book ki available_copies wapas badhao
    await pool.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
      [book_id]
    );

    // Step D: Check karo late hai ya nahi, aur fine lagao agar zaroorat ho
    const dueDate = new Date(transaction.due_date);
    const returnDate = new Date();  // aaj ki date

    // Dono dates ke beech ka difference milliseconds me nikalte hain, fir din me convert karte hain
    const diffTime = returnDate - dueDate;
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let fineRecord = null;

    if (daysLate > 0) {
      const finePerDay = 5;              // Har din late hone pe ₹5 fine (tum change kar sakte ho)
      const fineAmount = daysLate * finePerDay;

      const fineResult = await pool.query(
        `INSERT INTO fines (transaction_id, member_id, amount, days_late)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, transaction.member_id, fineAmount, daysLate]
      );

      fineRecord = fineResult.rows[0];
    }

    res.status(200).json({
      message: fineRecord ? 'Book returned late, fine applied' : 'Book returned successfully',
      transaction: result.rows[0],
      fine: fineRecord,   // Agar late nahi hai to ye null rahega
    });
  } catch (error) {
    console.error('Error returning book:', error.message);
    res.status(500).json({ error: 'Server error, could not return book' });
  }
};

// Function 3: Saari transactions ki list bhejo
const getAllTransactions = async (req, res) => {
  try {
    // JOIN use kar rahe hain taaki book title aur member name bhi saath me mile
    const result = await pool.query(
      `SELECT t.id, t.issue_date, t.due_date, t.return_date, t.status,
              b.title AS book_title, m.name AS member_name
       FROM transactions t
       JOIN books b ON t.book_id = b.id
       JOIN members m ON t.member_id = m.id
       ORDER BY t.id DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch transactions' });
  }
};

module.exports = { issueBook, returnBook, getAllTransactions };