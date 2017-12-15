var mongoose = require('mongoose');

var SubjectSchema = new mongoose.Schema({
  subject_name: { type: String, unique: true },
  subject_desc: String,
  subject_code: { type: String, unique: true },
  status: { type: Number, default: 1 },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', SubjectSchema);
