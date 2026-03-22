const Ticket = require("../models/Ticket");

const generateTicketId = () => {
  return "TCK-" + Date.now();
};

// Lecturer create ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, message, receiverRole } = req.body;

    if (!subject || !message || !receiverRole) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "coordinator"].includes(receiverRole)) {
      return res.status(400).json({ message: "Invalid receiver role" });
    }

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      subject: subject.trim(),
      message: message.trim(),
      sender: req.user.id,
      receiverRoles: [receiverRole],
      status: "pending",
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("sender", "name email role")
      .populate("repliedBy", "name email role");

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coordinator create ticket
exports.createCoordinatorTicket = async (req, res) => {
  try {
    const { subject, message, role } = req.body;

    if (!subject || !message || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["admin", "lic"].includes(role)) {
      return res.status(400).json({ message: "Invalid receiver role" });
    }

    const ticket = await Ticket.create({
      ticketId: generateTicketId(),
      subject: subject.trim(),
      message: message.trim(),
      sender: req.user.id,
      receiverRoles: [role],
      status: "pending",
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("sender", "name email role")
      .populate("repliedBy", "name email role");

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tickets received by current role
exports.getTickets = async (req, res) => {
  try {
    const role = req.user.role;

    const tickets = await Ticket.find({
      receiverRoles: role,
    })
      .populate("sender", "name email role")
      .populate("repliedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tickets created by current logged in user
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ sender: req.user.id })
      .populate("sender", "name email role")
      .populate("repliedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Reply ticket
exports.replyTicket = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply is required" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.reply = reply.trim();
    ticket.repliedBy = req.user.id;
    ticket.status = "replied";

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("sender", "name email role")
      .populate("repliedBy", "name email role");

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};