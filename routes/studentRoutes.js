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

// READ ONE
router.get("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student", error: err.message });
  }
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  try {
    // Authorization: Only allow user to update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized - Can only update own profile" });
    }
    
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
    // Authorization: Only allow user to delete their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized - Can only delete own profile" });
    }
    
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});


module.exports = router;
