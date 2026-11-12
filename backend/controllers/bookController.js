// Ye file books se related saara logic rakhti hai (get, add, update, delete)

const pool = require('../config/db');

// Function 1: Saari books ki list bhejo (search/filter ke saath)
const getAllBooks = async (req, res, next) => {
  try {
    const { title, author, category } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (title) {
      query += ` AND title ILIKE $${paramIndex}`;
      values.push(`%${title}%`);
      paramIndex++;
    }

    if (author) {
      query += ` AND author ILIKE $${paramIndex}`;
      values.push(`%${author}%`);
      paramIndex++;
    }

    if (category) {
      query += ` AND category ILIKE $${paramIndex}`;
      values.push(`%${category}%`);
      paramIndex++;
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// Function 2: Nayi book add karo (Admin only)
const addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, total_copies } = req.body;
    const copies = parseInt(total_copies, 10) || 1;

    if (copies < 0) {
      return res.status(400).json({ error: 'Total copies cannot be negative' });
    }

    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [title, author, isbn || null, category || null, copies]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Function 3: Book ki details update karo (Admin only)
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, total_copies, available_copies } = req.body;

    const total = parseInt(total_copies, 10);
    const available = parseInt(available_copies, 10);

    if (available < 0) {
      return res.status(400).json({ error: 'Available copies cannot be negative' });
    }
    if (available > total) {
      return res.status(400).json({ error: 'Available copies cannot exceed total copies' });
    }

    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, category = $4,
           total_copies = $5, available_copies = $6
       WHERE id = $7
       RETURNING *`,
      [title, author, isbn, category, total, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Function 4: Book delete karo (Admin only)
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if book has active transactions
    const activeTx = await pool.query(
      `SELECT id FROM transactions WHERE book_id = $1 AND status = 'issued'`,
      [id]
    );
    if (activeTx.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete book: copies are currently issued to members' });
    }

    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', deletedBook: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Function 5: Ek specific book ki detail do (ID se)
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
