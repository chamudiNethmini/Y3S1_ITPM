const express = require("express");
const router = express.Router();

const timetableEntryController = require("../controllers/timetableEntryController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get(
  "/resources",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.getSessionResources,
);

router.get(
  "/lic",
  verifyToken,
  authorizeRoles("lic"),
  timetableEntryController.getLicTimetable,
);

router.get("/", verifyToken, timetableEntryController.getTimetableEntries);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.createTimetableEntry,
);

router.put(
  "/send-to-lic",
  verifyToken,
  authorizeRoles("coordinator"),
  timetableEntryController.sendToLic,
);

router.put(
  "/send-to-admin",
  verifyToken,
  authorizeRoles("lic"),
  timetableEntryController.sendToAdmin,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "coordinator", "lic"),
  timetableEntryController.updateTimetableEntry,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.deleteTimetableEntry,
);

router.patch(
  "/:id/publish",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.publishTimetableEntry,
);

router.post(
  "/publish",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.publishAllTimetable,
);

module.exports = router;
