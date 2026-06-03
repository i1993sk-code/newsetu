const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

function generateSlug(name) {
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
  return slug || 'user' + Date.now();
}

router.post('/signup', async (req, res) => {
  try {
    const { name, businessName, phone, category, city, state, address, pincode, experience, priceRange, description, services } = req.body;
    if (!name || !phone || !category || !city) {
      return res.json({ success: false, message: 'Name, phone, category & city required' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.json({ success: false, message: 'Phone number must be exactly 10 digits' });
    }
    let slug = generateSlug(businessName || name);
    let counter = 1;
    while (await Provider.findOne({ slug })) {
      slug = generateSlug(businessName || name) + counter;
      counter++;
    }
    const provider = await Provider.create({
      name, businessName, phone, category, city, state,
      address, pincode, experience, priceRange, description,
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

router.post('/login', async (req, res) => {
  try {
    const { phone, slug } = req.body;
    if (!phone) return res.json({ success: false, message: 'Phone required' });
    if (!/^\d{10}$/.test(phone)) return res.json({ success: false, message: 'Invalid phone number' });
    const filter = slug ? { slug, phone } : { phone };
    const provider = await Provider.findOne(filter);
    if (!provider) return res.json({ success: false, message: 'Provider not found' });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/update/:slug', async (req, res) => {
  try {
    const { phone, name, businessName, category, city, state, address, pincode, experience, priceRange, description, services } = req.body;
    const provider = await Provider.findOne({ slug: req.params.slug });
    if (!provider) return res.json({ success: false, message: 'Provider not found' });
    if (phone !== provider.phone) return res.json({ success: false, message: 'Phone number mismatch' });
    if (name) provider.name = name;
    if (businessName !== undefined) provider.businessName = businessName;
    if (category) provider.category = category;
    if (city) provider.city = city;
    if (state !== undefined) provider.state = state;
    if (address !== undefined) provider.address = address;
    if (pincode !== undefined) provider.pincode = pincode;
    if (experience !== undefined) provider.experience = experience;
    if (priceRange !== undefined) provider.priceRange = priceRange;
    if (description !== undefined) provider.description = description;
    if (services) provider.services = services;
    provider.updatedAt = Date.now();
    await provider.save();
    res.json({ success: true, message: 'Profile updated', data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
