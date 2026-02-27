const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  login,
  createUser,
  getAllUsers,
  updateUserStatus,
  deleteUser
} = require("../controllers/authController");

const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");


// =============================
// PUBLIC ROUTE
// =============================

// Login route (no token required)
router.post("/login", login);


// =============================
// ADMIN ONLY ROUTES
// =============================

// Create new user
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


// =============================
// (Optional) Legacy status route - REMOVE if not needed
// =============================

// You already have updateUserStatus in controller,
// so this route is not needed anymore.
// If you keep it, protect it too:

router.put(
  "/status/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;