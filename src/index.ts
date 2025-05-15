import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

const app = express();
const PORT = 3000;

// SQLite connection
const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Middleware: Allow CORS
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Routes

// Get all categories
app.get('/api/categories', (_req: Request, res: Response) => {
  db.all('SELECT * FROM category', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get subcategories by category ID
app.get('/api/categories/:id/subcategories', (req: Request, res: Response) => {
  const categoryId = req.params.id;
  db.all('SELECT * FROM sub_category WHERE cat_id = ?', [categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get duas by subcategory ID
app.get('/api/subcategories/:id/duas', (req: Request, res: Response) => {
  const subCategoryId = req.params.id;
  db.all('SELECT * FROM dua WHERE subcat_id = ?', [subCategoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
