const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// READ ALL
router.get("/", auth, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
