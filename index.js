require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// 1. Setup Transporter using Environment Variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  // Use Gmail App Password here
  }
});

// 2. Health Check Route (Helps Render monitor your app)
app.get('/', (req, res) => {
  res.send('Bin Reminder Server is Live 🚀');
});

// 3. The Email Sending Route
app.post('/send-email', (req, res) => {
  const { recipient, message } = req.body;

  // Basic validation
  if (!recipient || !message) {
    return res.status(400).json({ error: 'Recipient and message are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Bin Reminder Alert 🗑️',
    html: `
      <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2e7d32;">Don't forget!</h2>
        <p style="font-size: 1.1em;">Today is the collection day for: <b>${message}</b></p>
        <hr>
        <small style="color: #888;">Automated Bin Reminder Service</small>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending mail:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  });
});

// 4. Use Render's Dynamic Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});