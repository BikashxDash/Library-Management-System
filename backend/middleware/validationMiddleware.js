// Ye file alag-alag entities (book, member) ke liye input validation rakhti hai

// Book data validate karo (add/update ke time)
const validateBook = (req, res, next) => {
  const { title, author, total_copies } = req.body;

  // Check 1: Title aur author khali nahi hone chahiye
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (!author || author.trim() === '') {
    return res.status(400).json({ error: 'Author is required' });
  }

  // Check 2: total_copies agar diya hai, to positive number hona chahiye
  if (total_copies !== undefined && (isNaN(total_copies) || total_copies <= 0)) {
    return res.status(400).json({ error: 'Total copies must be a positive number' });
  }

  next();  // Sab sahi hai, aage badho
};

// Member data validate karo (add/update ke time)
const validateMember = (req, res, next) => {
  const { name, email, phone } = req.body;

  // Check 1: Naam khali nahi hona chahiye
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Check 2: Email khali nahi ho, aur sahi format me ho
  if (!email || email.trim() === '') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Simple email pattern: kuch text @ kuch text . kuch text
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Check 3: Phone diya hai to 10 digit ka hona chahiye (India ke liye)
  if (phone && !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }

  next();
};

module.exports = { validateBook, validateMember };