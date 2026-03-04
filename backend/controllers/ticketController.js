const Ticket = require("../models/Ticket");
const User = require("../models/User");

const generateTicketId = () => {
  return "TCK-" + Date.now();
};

// Lecturer Raise Ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      subject,
      message,
      sender: req.user.id,
      receiverRoles: ["admin", "coordinator"]
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coordinator send separately
exports.createCoordinatorTicket = async (req, res) => {
  try {
    const { subject, message, role } = req.body;

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      subject,
      message,
      sender: req.user.id,
      receiverRoles: [role]
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tickets by role
exports.getTickets = async (req, res) => {
  try {
    const role = req.user.role;

    const tickets = await Ticket.find({
      receiverRoles: role
    })
      .populate("sender", "name email")
      .populate("repliedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply Ticket
exports.replyTicket = async (req, res) => {
  try {
    const { reply } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        repliedBy: req.user.id,
        status: "replied"
      },
      { new: true }
    );

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
