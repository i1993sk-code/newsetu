const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

function generateSlug(name) {
  let slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30);
  return slug || 'user' + Date.now();
}

router.post('/signup', async (req, res) => {
  try {
    const { name, businessName, phone, category, district, city, state, address, pincode, experience, priceRange, description, services } = req.body;
    if (!name || !phone || !category || !(district || city)) {
      return res.json({ success: false, message: 'Name, phone, category & district/city required' });
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
      name, businessName, phone, category, district, city, state,
      address, pincode, experience, priceRange, description,
      services: services || [], showPhone: true,
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
    const { category, district, city, pincode } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };
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
    const { phone, name, businessName, category, district, city, state, address, pincode, experience, priceRange, description, services, showPhone } = req.body;
    const provider = await Provider.findOne({ slug: req.params.slug });
    if (!provider) return res.json({ success: false, message: 'Provider not found' });
    if (phone !== provider.phone) return res.json({ success: false, message: 'Phone number mismatch' });
    if (name) provider.name = name;
    if (businessName !== undefined) provider.businessName = businessName;
    if (category) provider.category = category;
    if (district !== undefined) provider.district = district;
    if (city !== undefined) provider.city = city;
    if (state !== undefined) provider.state = state;
    if (address !== undefined) provider.address = address;
    if (pincode !== undefined) provider.pincode = pincode;
    if (experience !== undefined) provider.experience = experience;
    if (priceRange !== undefined) provider.priceRange = priceRange;
    if (description !== undefined) provider.description = description;
    if (services) provider.services = services;
    if (showPhone !== undefined) provider.showPhone = showPhone;
    provider.updatedAt = Date.now();
    await provider.save();
    res.json({ success: true, message: 'Profile updated', data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const ADMIN_PASSWORD = 'newsetu@2024';

function adminAuth(req, res, next) {
  if (req.query.adminPwd === ADMIN_PASSWORD || req.body?.adminPwd === ADMIN_PASSWORD) return next();
  res.json({ success: false, message: 'Unauthorized' });
}

router.post('/admin/login', (req, res) => {
  res.json({ success: req.body?.adminPwd === ADMIN_PASSWORD });
});

router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const { q } = req.query;
    let filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { businessName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }
    const total = await Provider.countDocuments(filter);
    const providers = await Provider.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ success: true, data: providers, count: providers.length, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/admin/delete/:id', adminAuth, async (req, res) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/delete-profile', async (req, res) => {
  try {
    const { phone, slug } = req.body;
    if (!phone || !slug) return res.json({ success: false, message: 'Phone and slug required' });
    const provider = await Provider.findOne({ slug });
    if (!provider) return res.json({ success: false, message: 'Profile not found' });
    if (provider.phone !== phone) return res.json({ success: false, message: 'Phone number does not match' });
    await Provider.findByIdAndDelete(provider._id);
    res.json({ success: true, message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/report/:slug', async (req, res) => {
  try {
    const provider = await Provider.findOne({ slug: req.params.slug });
    if (!provider) return res.json({ success: false, message: 'Provider not found' });
    provider.reportedAt = new Date();
    provider.reportReason = req.body.reason || 'Reported';
    await provider.save();
    res.json({ success: true, message: 'Reported. Team will review.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
