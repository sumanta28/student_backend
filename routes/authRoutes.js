const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      ...rest,
      email,
      password: hashedPassword
    });

    await student.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// CHECK EMAIL (while typing)
router.get("/check-email/:email", auth, async (req, res) => {
  try {
    const emailInput = req.params.email;
    // Search for any email containing the typed characters
    const student = await Student.findOne({ 
      email: { $regex: emailInput, $options: "i" } 
    });
    res.json({ exists: !!student });
  } catch (err) {
    res.status(500).json({ message: "Error checking email" });
  }
});


module.exports = router;
