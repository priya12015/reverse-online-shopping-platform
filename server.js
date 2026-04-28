require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes        = require('./routes/auth');
const requirementRoutes = require('./routes/requirements');
const offerRoutes       = require('./routes/offers');
const ratingRoutes      = require('./routes/ratings');
const chatHandler       = require('./socket/chatHandler');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }
});

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth',         authRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/offers',       offerRoutes);
app.use('/api/ratings',      ratingRoutes);

chatHandler(io);

/* ── Seed Demo Data ─────────────────────────────────────────── */
async function seed() {
  const User        = require('./models/User');
  const Requirement = require('./models/Requirement');
  const Offer       = require('./models/Offer');

  function score(price, budgetMax, rating, days) {
    return Math.round(
      (Math.max(0, 1 - price / budgetMax) * 0.40 +
       (rating / 5) * 0.35 +
       Math.max(0, 1 - days / 30) * 0.25) * 100 * 10) / 10;
  }

  const [b1, b2, s1, s2] = await User.insertMany([
    { name: 'Ravi Kumar',      email: 'ravi@demo.com',       password: 'demo123', role: 'buyer',  ratingScore: 4.8, verified: true },
    { name: 'Priya Sharma',    email: 'priya@demo.com',      password: 'demo123', role: 'buyer',  ratingScore: 4.5, verified: true },
    { name: 'TechZone Store',  email: 'techzone@demo.com',   password: 'demo123', role: 'seller', ratingScore: 4.7, ratingCount: 89, verified: true },
    { name: 'SmartDeals India',email: 'smartdeals@demo.com', password: 'demo123', role: 'seller', ratingScore: 4.3, ratingCount: 56, verified: true },
  ]);

  const day = 24 * 60 * 60 * 1000;
  const [r1, r2, r3, r4] = await Requirement.insertMany([
    {
      buyerId: b1._id, title: 'Samsung 65-inch 4K QLED TV',
      description: 'QLED preferred, budget ₹60k–₹80k. Need full warranty and professional installation. Smart TV features required.',
      category: 'Electronics', budgetMin: 60000, budgetMax: 80000, quantity: 1,
      deadline: new Date(Date.now() + 3 * day), offerCount: 2
    },
    {
      buyerId: b2._id, title: 'iPhone 15 Pro 256GB',
      description: 'Titanium Black or Natural Titanium. Original Apple warranty required. Sealed box only.',
      category: 'Electronics', budgetMin: 120000, budgetMax: 135000, quantity: 1,
      deadline: new Date(Date.now() + 2 * day), offerCount: 1
    },
    {
      buyerId: b1._id, title: 'Ergonomic Office Chair (Lumbar Support)',
      description: 'High-quality ergonomic chair for long work hours. Adjustable armrests, lumbar support, mesh back preferred.',
      category: 'Furniture', budgetMin: 8000, budgetMax: 15000, quantity: 2,
      deadline: new Date(Date.now() + 5 * day), offerCount: 0
    },
    {
      buyerId: b2._id, title: 'Plumber for Bathroom Renovation',
      description: 'Experienced plumber needed for complete 2-bathroom fitting: tiles, fixtures, shower installation.',
      category: 'Services', budgetMin: 25000, budgetMax: 40000, quantity: 1,
      deadline: new Date(Date.now() + 7 * day), offerCount: 0
    },
  ]);

  await Offer.insertMany([
    {
      requirementId: r1._id, sellerId: s1._id, price: 72000, deliveryDays: 3, warrantyMonths: 12,
      note: 'Samsung Authorized Reseller. Free installation + HDMI cables included.',
      score: score(72000, 80000, 4.7, 3)
    },
    {
      requirementId: r1._id, sellerId: s2._id, price: 68500, deliveryDays: 5, warrantyMonths: 12,
      note: 'Brand new sealed box. GST invoice included. Can negotiate slightly.',
      score: score(68500, 80000, 4.3, 5)
    },
    {
      requirementId: r2._id, sellerId: s1._id, price: 128000, deliveryDays: 2, warrantyMonths: 12,
      note: 'Official Apple reseller. Comes with free case worth ₹3,000.',
      score: score(128000, 135000, 4.7, 2)
    },
  ]);

  console.log('\n🌱 Demo accounts ready:');
  console.log('   👤 Buyer:  ravi@demo.com   / demo123');
  console.log('   👤 Buyer:  priya@demo.com  / demo123');
  console.log('   🏪 Seller: techzone@demo.com    / demo123');
  console.log('   🏪 Seller: smartdeals@demo.com  / demo123\n');
}

/* ── Start ──────────────────────────────────────────────────── */
async function start() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('✅ In-memory MongoDB connected');
  await seed();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`🚀 API running → http://localhost:${PORT}`)
  );
}

start().catch(console.error);
