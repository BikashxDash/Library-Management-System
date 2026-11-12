// Ye file dashboard ke liye summary stats deta hai

const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    // Total books count
    const totalBooks = await pool.query('SELECT COUNT(*) FROM books');

    // Total members count
    const totalMembers = await pool.query('SELECT COUNT(*) FROM members');

    // Kitni books abhi issue hain (return nahi hui)
    const issuedBooks = await pool.query(
      `SELECT COUNT(*) FROM transactions WHERE status = 'issued'`
    );

    // Overdue books - jinki due_date nikal chuki hai but abhi tak return nahi hui
    const overdueBooks = await pool.query(
      `SELECT COUNT(*) FROM transactions
       WHERE status = 'issued' AND due_date < CURRENT_DATE`
    );

    // Total unpaid fines ka amount
    const unpaidFines = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM fines WHERE status = 'unpaid'`
    );

    res.status(200).json({
      totalBooks: parseInt(totalBooks.rows[0].count, 10),
      totalMembers: parseInt(totalMembers.rows[0].count, 10),
      issuedBooks: parseInt(issuedBooks.rows[0].count, 10),
      overdueBooks: parseInt(overdueBooks.rows[0].count, 10),
      unpaidFines: parseFloat(unpaidFines.rows[0].total),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
