const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
require('dotenv').config();

// @desc    Register a new customer
// @route   POST /api/customers/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, code: otp });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your Email for Omkar Techno',
      text: `Your OTP is: ${otp}`,
    });

    res.status(201).json({ msg: 'OTP sent to email' });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Verify Email OTP
// @route   POST /api/customers/verify-email
// @access  Public
const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await Otp.findOne({ email, code: otp });
    if (!record) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    // Find the customer
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    // Mark as verified
    customer.isVerified = true;

    // If new password provided, update it
    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      customer.password = hashed;
    }

    await customer.save();
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ msg: 'Email verified successfully' });

  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};


// @desc    Login customer
// @route   POST /api/customers/login

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!customer.isVerified) {
      return res.status(403).json({ msg: "Email not verified. Please verify via OTP." });
    }

    const token = jwt.sign(
      { id: customer._id },
      process.env.JWT_SECRET,
      { expiresIn: "1000d" }
    );

    res.status(200).json({
      msg: "Login successful",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isVerified: customer.isVerified,
        createdAt: customer.createdAt,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    const { name, email, phone } = req.body;

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;

    await customer.save();

    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, code: otp });

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your Email for Omkar Techno',
    text: `Your OTP is: ${otp}`,
  });

  res.status(200).json({ msg: 'OTP sent to email' });
};


module.exports = { registerUser, verifyEmailOtp, loginCustomer, getProfile , updateProfile , sendOtp};
