const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: Number, unique: true, index: true },
  firstName: String,
  lastName: String,
  fullName: String,
  age: Number,
  gender: String,
  subject: String,
  email: { type: String, unique: true },
  password: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
