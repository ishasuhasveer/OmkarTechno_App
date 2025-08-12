const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder publicly
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

// Mount Routes
app.use("/api/customers", authRoutes);
app.use("/api/products", productRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.send("API is running fine");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
