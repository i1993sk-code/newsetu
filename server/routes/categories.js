const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

const ADMIN_PASSWORD = 'newsetu@2024';

function adminAuth(req, res, next) {
  if (req.query.adminPwd === ADMIN_PASSWORD || req.body?.adminPwd === ADMIN_PASSWORD) return next();
  return res.json({ success: false, message: 'Unauthorized' });
}

router.get('/', async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const existing = await Category.findOne({ name: { $regex: new RegExp('^' + req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
    if (existing) return res.json({ success: false, message: 'Category already exists' });
    const cat = await Category.create({ name: req.body.name });
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
