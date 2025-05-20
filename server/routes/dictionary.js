// server/routes/dictionary.js
const express    = require('express');
const router     = express.Router();
const Dictionary = require('../models/dictionary');

// GET all dictionary entries
router.get('/', async (req, res) => {
  console.log("📥 GET /api/dictionary");
  try {
    const entries = await Dictionary.find();
    console.log(`📤 Returning ${entries.length} entries`);
    res.json(entries);
  } catch (err) {
    console.error("❌ Error fetching entries:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dictionary/translate?phrase=...&source=...
router.get('/translate', async (req, res) => {
  const { phrase, source } = req.query;
  console.log(`📥 GET /api/dictionary/translate?phrase=${phrase}&source=${source}`);

  if (!phrase || !source) {
    console.warn("⚠️ Missing phrase or source");
    return res.status(400).json({ message: 'Missing phrase or source' });
  }

  const cleanPhrase = phrase.trim().toLowerCase();

  try {
    // Try full-phrase lookup
    const regex = new RegExp(`^${cleanPhrase}$`, 'i');
    const fullEntry = await Dictionary.findOne(
      source === 'english'
        ? { englishPhrase: regex }
        : { arabiJubaPhrase: regex }
    );

    if (fullEntry) {
      console.log("✅ Found full match:", fullEntry);
      return res.json({
        englishPhrase: fullEntry.englishPhrase,
        arabiJubaPhrase: fullEntry.arabiJubaPhrase,
        notes: fullEntry.notes || ''
      });
    }

    // Fallback: word-by-word
    const words = cleanPhrase.split(/\s+/);
    const entries = await Dictionary.find();
    const enToAj = {}, ajToEn = {};
    entries.forEach(e => {
      enToAj[e.englishPhrase] = e.arabiJubaPhrase;
      ajToEn[e.arabiJubaPhrase] = e.englishPhrase;
    });

    const translatedWords = words.map(w => {
      const key = w.toLowerCase();
      if (source === 'english') return enToAj[key] || w;
      return ajToEn[key] || w;
    });
    const translatedPhrase = translatedWords.join(' ');
    console.log("🔄 Fallback translated phrase:", translatedPhrase);

    // Return in same shape as fullEntry
    if (source === 'english') {
      return res.json({ englishPhrase: cleanPhrase, arabiJubaPhrase: translatedPhrase });
    } else {
      return res.json({ englishPhrase: translatedPhrase, arabiJubaPhrase: cleanPhrase });
    }
  } catch (err) {
    console.error("❌ Error in translate lookup:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST new dictionary entry
router.post('/', async (req, res) => {
  console.log("📥 POST /api/dictionary body:", req.body);
  const { englishPhrase, arabiJubaPhrase, category, notes } = req.body;
  if (!englishPhrase || !arabiJubaPhrase) {
    console.warn("⚠️ Missing englishPhrase or arabiJubaPhrase in request");
    return res.status(400).json({ message: 'englishPhrase and arabiJubaPhrase are required' });
  }
  const entry = new Dictionary({
    englishPhrase: englishPhrase.trim().toLowerCase(),
    arabiJubaPhrase: arabiJubaPhrase.trim().toLowerCase(),
    category: category || 'general',
    notes: notes || ''
  });
  console.log("🛠 Saving new entry to DB:", entry);
  try {
    const newEntry = await entry.save();
    console.log("✅ Saved new entry:", newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("❌ Error saving new entry:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT update dictionary entry
router.put('/:id', async (req, res) => {
  console.log(`📥 PUT /api/dictionary/${req.params.id} body:`, req.body);
  try {
    const updatedEntry = await Dictionary.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedEntry) {
      console.warn("⚠️ Entry not found for update:", req.params.id);
      return res.status(404).json({ message: 'Entry not found' });
    }
    console.log("✅ Updated entry:", updatedEntry);
    res.json(updatedEntry);
  } catch (err) {
    console.error("❌ Error updating entry:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE dictionary entry
router.delete('/:id', async (req, res) => {
  console.log(`📥 DELETE /api/dictionary/${req.params.id}`);
  try {
    const deleted = await Dictionary.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.warn("⚠️ Entry not found for deletion:", req.params.id);
      return res.status(404).json({ message: 'Entry not found' });
    }
    console.log("🗑 Deleted entry:", req.params.id);
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error("❌ Error deleting entry:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


