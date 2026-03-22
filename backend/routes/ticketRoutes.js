const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, ticketController.createTicket);
router.post("/create-coordinator", verifyToken, ticketController.createCoordinatorTicket);

router.get("/all", verifyToken, ticketController.getTickets);
router.get("/my", verifyToken, ticketController.getMyTickets);

router.put("/reply/:id", verifyToken, ticketController.replyTicket);

module.exports = router;