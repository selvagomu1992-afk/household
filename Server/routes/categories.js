import { Router } from 'express';
import Category from '../models/Category.js';
import DEFAULT_HEADINGS from '../seedData.js';

const router = Router();

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

router.get('/', async (req, res) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Promise.all(DEFAULT_HEADINGS.map((h) => Category.create(h)));
    }
    const cats = await Category.find().sort({ createdAt: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/heading', async (req, res) => {
  try {
    const { title, icon } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const headingId = slugify(title) + '_' + Date.now();
    const cat = await Category.create({ headingId, title, icon: icon || '📁', items: [] });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:headingId/item', async (req, res) => {
  try {
    const { label, icon } = req.body;
    if (!label) return res.status(400).json({ error: 'Label is required' });
    const key = slugify(label) + '_' + Date.now();
    const cat = await Category.findOneAndUpdate(
      { headingId: req.params.headingId },
      { $push: { items: { key, label, icon: icon || '📦' } } },
      { new: true },
    );
    if (!cat) return res.status(404).json({ error: 'Heading not found' });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:headingId/item/:key', async (req, res) => {
  try {
    const cat = await Category.findOneAndUpdate(
      { headingId: req.params.headingId },
      { $pull: { items: { key: req.params.key } } },
      { new: true },
    );
    if (!cat) return res.status(404).json({ error: 'Heading not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:headingId', async (req, res) => {
  try {
    const cat = await Category.findOneAndDelete({ headingId: req.params.headingId });
    if (!cat) return res.status(404).json({ error: 'Heading not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
