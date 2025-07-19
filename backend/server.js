const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/reportdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EntrySchema = new mongoose.Schema({
   lotNo: Number,
   lotSize: String,
   UnitNo: String,
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

app.listen(5000, () => console.log('API running on http://localhost:5000'));
