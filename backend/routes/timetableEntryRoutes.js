const express = require("express");
const router = express.Router();

const timetableEntryController = require("../controllers/timetableEntryController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

router.get(
  "/lecturers",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
  timetableEntryController.getLecturers,
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
  "/:id",
  verifyToken,
  authorizeRoles("admin", "coordinator"),
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

module.exports = router;
