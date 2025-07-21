const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EntrySchema = new mongoose.Schema({
   lotNo: Number,
   lotSize: String,
   UnitNo: String,
   customerName: String,
  reports: [String],
}, { timestamps: true });

const Entry = mongoose.model('ReportsTracker', EntrySchema);

const app = express();
app.use(cors());
app.use(express.json());

// Get all
app.get('/entries', async (req, res) => {
  const entries = await Entry.find().sort({ updatedAt: -1 });
  res.json(entries);
});

// Create
app.post('/entries', async (req, res) => {
  const newEntry = new Entry(req.body);
  await newEntry.save();
  res.json(newEntry);
});

// Update
app.put('/entries/:id', async (req, res) => {
  const updated = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete
app.delete('/entries/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`API running on port ${PORT}`));

