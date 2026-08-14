// Ye middleware check karta hai ki request ke saath valid token hai ya nahi
// Agar valid hai, tabhi aage jaane dega; nahi to error bhej dega

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Token usually "Authorization" header me aata hai, format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, access denied' });
  }

  const token = authHeader.split(' ')[1];  // "Bearer xyz123" me se sirf "xyz123" nikal rahe hain

  try {
    // Token verify karo secret key se
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Decoded data (id, role) ko request me attach kar diya, aage use ho sakta hai
    next();               // Sab sahi hai, ab actual route function chalne do
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = protect;