const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

function generateSlug(name) {
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
  return slug || 'user' + Date.now();
}

router.post('/signup', async (req, res) => {
  try {
    const { name, businessName, phone, category, city, services } = req.body;
    if (!name || !phone || !category || !city) {
      return res.json({ success: false, message: 'Name, phone, category & city required' });
    }
    let slug = generateSlug(businessName || name);
    let counter = 1;
    while (await Provider.findOne({ slug })) {
      slug = generateSlug(businessName || name) + counter;
      counter++;
    }
    const provider = await Provider.create({
      name, businessName, phone, category, city,
      services: services || [],
      slug, plan: 'free', isActive: true
    });
    res.json({
      success: true,
      message: 'Provider registered',
      data: {
        ...provider.toObject(),
        website: `https://newsetu.in/provider/${slug}`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const provider = await Provider.findOne({ slug: req.params.slug, isActive: true });
    if (!provider) return res.json({ success: false, message: 'Provider not found' });
    provider.totalViews += 1;
    await provider.save();
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { category, city, pincode } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (pincode) filter.pincode = pincode;
    const providers = await Provider.find(filter).sort({ plan: -1, averageRating: -1 });
    res.json({ success: true, data: providers, count: providers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
