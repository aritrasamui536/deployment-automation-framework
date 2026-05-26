const express = require('express');
const router = express.Router();
const Deployment = require('../models/Deployment');
const Log = require('../models/Log');
const auth = require('../middleware/auth');

// Get all deployments
router.get('/', auth, async (req, res) => {
  try {
    const deployments = await Deployment.find()
      .populate('deployedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(deployments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single deployment
router.get('/:id', auth, async (req, res) => {
  try {
    const deployment = await Deployment.findById(req.params.id)
      .populate('deployedBy', 'name email');
    if (!deployment) return res.status(404).json({ message: 'Deployment not found' });
    res.json(deployment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create deployment
router.post('/', auth, async (req, res) => {
  try {
    const { app, branch, environment, framework, logs } = req.body;
    const deployment = new Deployment({
      app, branch, environment, framework, logs,
      deployedBy: req.user.id,
      status: 'pending',
    });
    await deployment.save();

    // Auto logs
    await Log.insertMany([
      { deploymentId: deployment._id, app, level: 'info', message: `Deployment triggered for ${app} on ${branch}` },
      { deploymentId: deployment._id, app, level: 'info', message: `Environment: ${environment} | Framework: ${framework || 'N/A'}` },
      { deploymentId: deployment._id, app, level: 'info', message: 'Status set to pending — waiting for runner...' },
    ]);

    res.status(201).json(deployment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update deployment status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, logs, duration } = req.body;
    const deployment = await Deployment.findByIdAndUpdate(
      req.params.id,
      { status, logs, duration },
      { new: true }
    );
    if (!deployment) return res.status(404).json({ message: 'Deployment not found' });

    // Auto log on status change
    const levelMap = { success: 'success', failed: 'error', running: 'info', pending: 'info' };
    await Log.create({
      deploymentId: deployment._id,
      app: deployment.app,
      level: levelMap[status] || 'info',
      message: `Status updated to [${status.toUpperCase()}]${duration ? ` — duration: ${duration}s` : ''}`,
    });

    res.json(deployment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete deployment
router.delete('/:id', auth, async (req, res) => {
  try {
    const deployment = await Deployment.findByIdAndDelete(req.params.id);
    if (!deployment) return res.status(404).json({ message: 'Deployment not found' });
    await Log.deleteMany({ deploymentId: req.params.id });
    res.json({ message: 'Deployment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const total = await Deployment.countDocuments();
    const success = await Deployment.countDocuments({ status: 'success' });
    const failed = await Deployment.countDocuments({ status: 'failed' });
    const running = await Deployment.countDocuments({ status: 'running' });
    res.json({
      total, success, failed, running,
      successRate: total > 0 ? ((success / total) * 100).toFixed(1) + '%' : '0%',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
