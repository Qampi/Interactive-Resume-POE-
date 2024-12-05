const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route for the contact form
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // SMTP username
                pass: process.env.SMTP_PASS  // SMTP password
            },
        });

        // Email options
        const mailOptions = {
            from: `"${name}" <${email}>`, // Sender's email
            to: process.env.RECEIVER_EMAIL, // Your email to receive messages
            subject: `Contact Form Message from ${name}`,
            text: message,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).send({ success: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send message. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
