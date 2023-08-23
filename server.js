// server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const dbHost = process.env.DB_Host;


const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(`${dbHost}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Image schema and model
const imageSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Image = mongoose.model('Image', imageSchema);

// Set up Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    // console.log(req.body)
    const image = new Image(req.body);
    await image.save();
    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
