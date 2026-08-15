// Ye file books se related saara logic rakhti hai (get, add, update, delete)

const pool = require('../config/db');  // Database connection import kiya

// Function 1: Saari books ki list bhejo (search/filter ke saath)
const getAllBooks = async (req, res) => {
  try {
    // req.query me URL ke "?" ke baad wali values milti hain
    // Jaise /api/books?title=harry&category=Fiction
    const { title, author, category } = req.query;

    // Base query - ye har case me chalegi
    let query = 'SELECT * FROM books WHERE 1=1';
    const values = [];   // Query ke andar $1, $2... ki actual values yahan jayengi
    let paramIndex = 1;  // $1, $2 karke counter badhta jayega

    // Agar title diya hai, query me add karo
    if (title) {
      query += ` AND title ILIKE $${paramIndex}`;
      values.push(`%${title}%`);   // % ka matlab - kahin bhi match ho jaye (partial search)
      paramIndex++;
    }

    // Agar author diya hai, query me add karo
    if (author) {
      query += ` AND author ILIKE $${paramIndex}`;
      values.push(`%${author}%`);
      paramIndex++;
    }

    // Agar category diya hai, query me add karo
    if (category) {
      query += ` AND category ILIKE $${paramIndex}`;
      values.push(`%${category}%`);
      paramIndex++;
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch books' });
  }
};

// Function 2: Nayi book add karo
const addBook = async (req, res) => {
  try {
    // req.body me wo data aayega jo frontend/Postman se bheja jayega
    const { title, author, isbn, category, total_copies } = req.body;

    // SQL query me $1, $2... placeholders hain - ye SQL injection se bachate hain
    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [title, author, isbn, category, total_copies]
    );

    // RETURNING * ki wajah se newly added book wapas milegi
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Server error, could not add book' });
  }
};

// Function 3: Book ki details update karo (ID ke basis pe)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;  // URL se book ki ID milegi (jaise /api/books/1)
    const { title, author, isbn, category, total_copies, available_copies } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, category = $4,
           total_copies = $5, available_copies = $6
       WHERE id = $7
       RETURNING *`,
      [title, author, isbn, category, total_copies, available_copies, id]
    );

    // Agar wo ID exist hi nahi karti, to rows empty aayega
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ error: 'Server error, could not update book' });
  }
};

// Function 4: Book delete karo (ID ke basis pe)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully', deletedBook: result.rows[0] });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({ error: 'Server error, could not delete book' });
  }
};

// Function: Ek specific book ki detail do (ID se)
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error.message);
    res.status(500).json({ error: 'Server error, could not fetch book' });
  }
};

// Is function ko export kar rahe hain taaki routes file me use ho sake
module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };