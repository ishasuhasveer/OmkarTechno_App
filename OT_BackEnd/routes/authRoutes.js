const express = require("express");
const { 
  registerUser, 
  loginCustomer, 
  verifyEmailOtp, 
  getProfile, 
  updateProfile,sendOtp
} = require("../controllers/customerController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginCustomer);
router.post("/verify-email", verifyEmailOtp);
router.get("/profile", protect, getProfile);
router.put("/update", protect, updateProfile); 
router.post('/send-otp', sendOtp);


module.exports = router;
