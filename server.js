// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { v4: uuidv4 } = require('uuid'); 
const cloudinary = require("cloudinary").v2;
const path = require('path');
const AdmZip = require('adm-zip');
const fs = require('fs').promises; 
// import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const dbHost = process.env.DB_Host;

const app = express();
// Increase payload limit to 1GB
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ extended: true, limit: '1gb' }));
app.use(cors());
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(`${dbHost}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define an object to store the latest updated image
let updatedImageArray = [];

 
// Define Image schema and model
const imageSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  image: String,
  
});
const Image = mongoose.model("Image", imageSchema);

// Set up Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Handle image upload
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const { name, image, number, email } = req.body; // Destructure name and image from the request body   
//     const newImage = new Image({ name, email, number, image}); // Create a new Image instance
//     await newImage.save(); // Save the new image to the collection
//     const response = await axios.post('localhost/findImage',image);
//     if(response.status === 201){     
//        const uniqueIds = response.data;     
//        const images = await Image.find({ uniqueId: { $in: uniqueIds } });     
//        console.log("Retrieved images:", images);
//        res.json({ message: "Image uploaded successfully" });
//     }
//     res.json({message: "hello"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error uploading image" });
//   }
// });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, number, email,image } = req.body;
    const uniqueId = uuidv4();
    const newImage = new Image({
      name,
      email,
      number,
      image,     
    });

    await newImage.save();
    const username = 'callback';
    const imageDataParts = image.split(",");
    const base64Image = imageDataParts[1];
    const headers = {
      userid: "Event@kochi",
      clientsecretkey: "RandomGeneratedPassword@kochi",
    };
    const response = await axios.post('http://localhost:8000/face_verify', 
      {
        Image_Name: username,
        Image_Base64: base64Image,
      },
      { headers }
    );
    console.log(response.data, "response from sachin");
    if (response.status === 200) {
      const localFilePaths = response.data;
      const cloudinaryUrls = []; 

      for (const localFilePath of localFilePaths) {
        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath);
        cloudinaryUrls.push(cloudinaryResponse.secure_url);
      }

      res.json({ message: "Images uploaded to Cloudinary successfully", ok:true, cloudinaryUrls });
    } else {
      res.json({ message: "hello" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

app.post("/upload-zip", upload.single("zipFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No zip file provided" });
    }

    const zipFile = req.file.buffer;
    const uploadsDir = path.join(__dirname, 'uploads');

    // Ensure the 'uploads' directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save the zip file to disk
    const zipFilePath = path.join(uploadsDir, 'uploaded.zip');
    await fs.writeFile(zipFilePath, zipFile);

    // Extract the contents of the zip file
    const extractionPath = path.join(uploadsDir, 'extracted');
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractionPath, true);

    // Clean up: remove the uploaded zip file
    await fs.unlink(zipFilePath);

    res.json({ message: "Zip file uploaded and extracted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading and extracting zip file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
