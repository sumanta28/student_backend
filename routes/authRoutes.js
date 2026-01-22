const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password, ...rest } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = new Student({
    ...rest,
    email,
    password: hashedPassword
  });

  await student.save();
  res.json({ message: "Signup successful" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

module.exports = router;
