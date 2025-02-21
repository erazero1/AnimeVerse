require('dotenv').config({ path: './secrets.env' });
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")
const { verificationCodes } = require("../verificationStore");

exports.register = async (req, res) => {
  try {
    const { email, username, password, verification } = req.body;
    
    if (!verification || verificationCodes[email] !== verification) {
      return res.status(400).json({ success: false, message: "Invalid or missing verification code" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }
    
    const customid = Date.now().toString();
    
    const user = new User({
      customid,
      name: username,
      email,
      password,
      role: "user",
    });
    
    await user.save();
    
    delete verificationCodes[email];
    
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ "name": username });

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.verification = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    // Generate and store the verification code
    const verificationCode = generateVerificationCode();
    verificationCodes[email] = verificationCode;
    
    // Send the email with the code
    await sendEmail(email, verificationCode);
    
    res.status(200).json({ success: true, message: "Verification code sent" });
  } catch (err) {
    console.error("Error in verification endpoint:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "mail.ru",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verification code",
    text: `Your verification code is: ${verificationCode}`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully: ${info.response}`);
};