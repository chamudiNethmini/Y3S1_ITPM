const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/AuditLog");
const crypto = require("crypto");


// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Account pending approval" });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Account suspended" });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server config error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // AUDIT LOG
    await AuditLog.create({
      action: "User Logged In",
      performedBy: user._id,
      targetUser: user._id
    });

    res.json({
  token,
  role: user.role,
  name: user.name,
  email: user.email,
  id: user._id
});

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// CREATE USER (WITH EMAIL VALIDATION)
// =========================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔴 EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "pending"
    });

    // AUDIT LOG
    await AuditLog.create({
      action: "User Created",
      performedBy: req.user?.id,
      targetUser: newUser._id
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// GET ALL USERS
// =========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// GET PROFILE
// =========================
exports.getProfile = async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user); // 👈 DEBUG

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// UPDATE USER STATUS
// =========================
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select("-password");

    // AUDIT LOG
    await AuditLog.create({
      action: `User status changed to ${status}`,
      performedBy: req.user.id,
      targetUser: user._id
    });

    res.json({
      message: "Status updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// UPDATE USER ROLE
// =========================
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    await AuditLog.create({
      action: `User role changed to ${role}`,
      performedBy: req.user.id,
      targetUser: user._id
    });

    res.json({
      message: "Role updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// CHANGE PASSWORD
// =========================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }
    
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    
    // AUDIT LOG
    await AuditLog.create({
      action: "Password Changed",
      performedBy: req.user.id,
      targetUser: req.user.id
    });
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// DELETE USER
// =========================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);

    // AUDIT LOG
    await AuditLog.create({
      action: "User Deleted",
      performedBy: req.user.id,
      targetUser: user._id
    });

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// GET AUDIT LOGS
// =========================
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "name email")
      .populate("targetUser", "name email")
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// FORGOT PASSWORD
// =========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({
      message: "Password reset token generated",
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    // AUDIT LOG
    await AuditLog.create({
      action: "Password Reset",
      performedBy: user._id,
      targetUser: user._id
    });

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};