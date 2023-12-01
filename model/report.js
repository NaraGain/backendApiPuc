const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'exam',
    },
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('report', reportSchema)