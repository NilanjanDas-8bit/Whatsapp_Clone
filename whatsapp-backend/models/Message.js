// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  message: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  meta_msg_id: String
});

module.exports = mongoose.model("Message", MessageSchema, "processed_messages");
