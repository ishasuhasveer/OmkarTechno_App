const Customer = require("../models/Customer");

exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    res.status(200).json({ success: true, customer });
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
