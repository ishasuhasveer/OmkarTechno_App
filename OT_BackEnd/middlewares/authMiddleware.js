const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select('-password');

    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    req.user = customer;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ msg: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
