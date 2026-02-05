const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// READ ALL
router.get("/", auth, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});


module.exports = router;
