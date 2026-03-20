const express = require("express");
const router = express.Router();

const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post("/", verifyToken, authorizeRoles("coordinator"), createResource);
router.get("/", verifyToken, authorizeRoles("coordinator"), getAllResources);
router.get("/:id", verifyToken, authorizeRoles("coordinator"), getResourceById);
router.put("/:id", verifyToken, authorizeRoles("coordinator"), updateResource);
router.delete("/:id", verifyToken, authorizeRoles("coordinator"), deleteResource);

module.exports = router;