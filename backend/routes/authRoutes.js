const express = require("express");
const router = express.Router();

// ================= CONTROLLERS =================
const {
  login,
  createUser,
  getAllUsers,
  getProfile,
  updateUserStatus,
  updateUserRole,
  changePassword,
  deleteUser,
  getAuditLogs,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// ================= MIDDLEWARE =================
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================

// Login (no token required)
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// ================= AUTHENTICATED USER ROUTES =================

// Get Profile (any authenticated user)
router.get("/profile", verifyToken, getProfile);

// Change Password (any authenticated user)
router.put("/change-password", verifyToken, changePassword);

// ================= ADMIN ONLY ROUTES =================

// Create user
router.post("/create-user", verifyToken, authorizeRoles("admin"), createUser);

// Get all users
router.get(
  "/all-users",
  verifyToken,
  authorizeRoles("admin", "coordinator", "lic"),
  getAllUsers,
);

// Update user status
router.put(
  "/update-status/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUserStatus,
);

// Update user role
router.put(
  "/update-role/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUserRole,
);

// Delete user
router.delete(
  "/delete-user/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser,
);

// Audit Logs (Admin only)
router.get("/audit-logs", verifyToken, authorizeRoles("admin"), getAuditLogs);

module.exports = router;
