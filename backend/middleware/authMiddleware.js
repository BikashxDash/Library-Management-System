// Ye middleware check karta hai ki request ke saath valid token hai ya nahi
// Agar valid hai, tabhi aage jaane dega; nahi to error bhej dega

const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Database me user exist karta hai ya nahi verify karo
    const userResult = await pool.query(
      'SELECT id, name, email, role, status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    const user = userResult.rows[0];

    // Status check: pending ya rejected users access nahi kar sakte
    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending admin approval' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account has been rejected' });
    }
    if (user.status !== 'approved') {
      return res.status(403).json({ error: 'Account not active' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    // Agar role member hai, to corresponding members table se member_id attach karo
    if (user.role === 'member') {
      const memberResult = await pool.query(
        'SELECT id, is_active FROM members WHERE email = $1',
        [user.email]
      );
      if (memberResult.rows.length > 0) {
        req.user.member_id = memberResult.rows[0].id;
        req.user.is_active = memberResult.rows[0].is_active;
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Ye middleware check karta hai ki logged-in user Admin hai ya nahi
// Hamesha 'protect' ke BAAD use hoga
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

module.exports = { protect, isAdmin };
