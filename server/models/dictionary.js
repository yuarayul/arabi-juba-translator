// server/models/dictionary.js
const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  englishPhrase:     { type: String, required: true },
  arabiJubaPhrase:   { type: String, required: true },
  englishAudio:      { type: String, default: null },     // optional audio URL
  arabiJubaAudio:    { type: String, default: null },
  category:          { type: String, default: 'general' },
  notes:             { type: String, default: '' }
});

module.exports = mongoose.model('Dictionary', dictionarySchema);
