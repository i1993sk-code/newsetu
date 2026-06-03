require('dotenv').config();
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

app.get(['/', '/api/health', '/api/health ', '/api/health%20'], (req, res) => {
  res.json({ status: 'ok', message: 'NewSetu API is running' });
});

const providerRoutes = require('./routes/provider');
const categoryRoutes = require('./routes/categories');
app.use('/api/provider', providerRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

const Category = require('./models/Category');

const SITE_URL = 'https://newsetu.in';

app.get('/sitemap.xml', async (req, res) => {
  try {
    const providers = await Provider.find({ isActive: true }).select('slug updatedAt');
    const urls = providers.map(p => `  <url>
    <loc>${SITE_URL}/provider/${p.slug}</loc>
    <lastmod>${p.updatedAt?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');
    res.header('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/signup</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
${urls}
</urlset>`);
  } catch { res.status(500).send('Error generating sitemap'); }
});

const DEFAULT_CATEGORIES = ['Plumber','Electrician','Beautician','Tutor','CA','Lawyer','Mechanic','Painter','Carpenter','AC Repair','Cook','Driver','Maid','Security Guard','Photographer','Event Planner','Fitness Trainer','Web Developer','Designer'];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    for (const name of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate({ name: { $regex: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } }, { name }, { upsert: true });
    }
    console.log('Categories seeded');
  })
  .catch(err => console.log('MongoDB error:', err.message));

http.createServer(app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
