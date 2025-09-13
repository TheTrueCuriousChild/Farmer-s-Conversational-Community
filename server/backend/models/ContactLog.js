const mongoose = require('mongoose');

const contactLogSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, required: true },
  method: { type: String, enum: ['call', 'sms', 'whatsapp'], required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactLog', contactLogSchema);