const express = require('express');
const ContactLog = require('../models/ContactLog');
const IVRLog = require('../models/IVRLog');

const router = express.Router();

// Log a contact request (call, sms, whatsapp)
router.post('/contact', async (req, res) => {
  try {
    const { name, phone, method, message } = req.body;
    if (!phone || !method) {
      return res.status(400).json({ success: false, message: 'Phone and method are required.' });
    }
    const log = await ContactLog.create({ name, phone, method, message });
    res.json({ success: true, data: log, message: 'Contact log saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Log an IVR call
router.post('/ivr', async (req, res) => {
  try {
    const { phone, language, optionSelected, callRecordingUrl, notes } = req.body;
    if (!phone || !language) {
      return res.status(400).json({ success: false, message: 'Phone and language are required.' });
    }
    const log = await IVRLog.create({ phone, language, optionSelected, callRecordingUrl, notes });
    res.json({ success: true, data: log, message: 'IVR log saved.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
