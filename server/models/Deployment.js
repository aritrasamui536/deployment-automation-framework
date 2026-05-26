const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
  app: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    default: 'main',
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'failed'],
    default: 'pending',
  },
  framework: {
    type: String,
    enum: ['jenkins', 'github-actions', 'terraform', 'ansible', 'argocd', 'other'],
    default: 'other',
  },
  deployedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  logs: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Deployment', deploymentSchema);