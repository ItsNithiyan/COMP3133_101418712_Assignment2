import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  profile_picture: { type: String }, // Ensure this field is defined
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model('Employee', EmployeeSchema);
