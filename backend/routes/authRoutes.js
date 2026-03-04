const express = require("express");
const router = express.Router();

// IMPORTS 

// Controllers
const {
  updateUserRole,
  login,
  createUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAuditLogs,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Middleware
const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// ================= PUBLIC ROUTES =================

// Login (no token required)
router.post("/login", login);


// ================= ADMIN ONLY ROUTES =================

// Create user
router.post(
  "/create-user",
  verifyToken,
  authorizeRoles("admin"),
  createUser
);

// Get all users
router.get(
  "/all-users",
  verifyToken,
  authorizeRoles("admin"),
  getAllUsers
);

// Update user status
router.put(
  "/update-status/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUserStatus
);

// Delete user
router.delete(
  "/delete-user/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser
);

// Audit Logs (Admin only)
router.get(
  "/audit-logs",
  verifyToken,
  authorizeRoles("admin"),
  getAuditLogs
);

router.put(
  "/update-role/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUserRole
);

router.put(
  "/update-role/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUserRole
);


module.exports = router;