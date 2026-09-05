require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const supabase = require('./db/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', service: 'mini-trello-api' });
});

app.use('/api/tasks', taskRoutes);

// Serve the built frontend (production / Vercel)
// Path: ../frontend/dist relative to this backend folder
const distDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  // SPA fallback: any non-API GET returns index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Central error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error.',
  });
});

// For local development only. Vercel runs `app` as a serverless function.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[api] Mini-Trello API running on http://localhost:${PORT}`);
  });
}

module.exports = app;