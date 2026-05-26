const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  deploymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deployment', required: true },
  app: { type: String, required: true },
  level: { type: String, enum: ['info', 'success', 'error', 'warn'], default: 'info' },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
