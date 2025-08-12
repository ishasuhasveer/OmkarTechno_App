const express = require("express");
const router = express.Router();
const { getCustomerProfile } = require("../controllers/profileController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/profile", authenticateToken, getCustomerProfile);

module.exports = router;
