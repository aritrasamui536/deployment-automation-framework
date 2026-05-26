const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
}

// ?? logs (latest 100)
router.get('/', auth, async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100).populate('deploymentId', 'app environment');
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ????????? deployment ?? logs
router.get('/:deploymentId', auth, async (req, res) => {
  try {
    const logs = await Log.find({ deploymentId: req.params.deploymentId }).sort({ createdAt: 1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
