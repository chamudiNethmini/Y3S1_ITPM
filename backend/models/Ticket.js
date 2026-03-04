const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiverRoles: [{
    type: String
  }],
  reply: {
    type: String
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
