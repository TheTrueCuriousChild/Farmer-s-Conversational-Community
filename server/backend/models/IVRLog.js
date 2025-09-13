const mongoose = require('mongoose');

const ivrLogSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  language: { type: String, enum: ['en', 'ml'], required: true },
  optionSelected: { type: String },
  timestamp: { type: Date, default: Date.now },
  callRecordingUrl: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model('IVRLog', ivrLogSchema);