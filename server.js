// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

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
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define an object to store the latest updated image
let updatedImageArray = [];

// Define Image schema and model
const imageSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Image = mongoose.model("Image", imageSchema);

const editedimageSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const EditedImage = mongoose.model("EditedImage", editedimageSchema);

// Set up Multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, image } = req.body; // Destructure name and image from the request body
    const newImage = new Image({ name, image }); // Create a new Image instance
    await newImage.save(); // Save the new image to the collection
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

const storeUpdatedImage = (name, image) => {
  updatedImageArray.push({ name, image });
};

const edittheimg = async () => {
  try {
    const image = await Image.findOne();
    if (!image) {
      console.log("No image data to process.");
      return;
    }
    
    
    const username = image.name;
    const imageDataParts = image.image.split(","); // Split at the comma
    const base64Image = imageDataParts[1];
    const headers = {
      userid: "Event",
      clientsecretkey: "RandomGeneratedPassword@"
    };
    const response = await axios.post("https://realmepython.stuns.org/extract_face", {
        Image_Name : username,
        Image_Base64: base64Image,
      },{ headers });

    console.log(response.data, 'response from sachin');
    if (response.status === 200) {
      const updatedImage = `data:image/jpeg;base64,${response.data}`; // Assuming the response structure is correct
      const editedImage = new EditedImage({
        name: username,
        image: updatedImage,
      });
      await editedImage.save();
      await Image.deleteOne({ _id: image._id }); // Properly delete the specific image
      console.log("Image processed and updated.");
      // Store the updated image and name in the array
      storeUpdatedImage(username, updatedImage);
    }else {
      console.log("Server responded with an error:", response.status);
    }
  } catch (error) {
    await Image.deleteOne({}); // Delete the document if response is 500 and details is empty
    // if(response.status === 500 && response.data.details === ""){
    //   console.log("Deleted document due to error 500 and empty details.");
    // } else{
    //   console.log(error)
    // }
    console.log(error);
  }
};

// Define a route for the GET API
app.get("/get-updated-image", async (req, res) => {
  // try {
  //   if (updatedImageArray.length > 0) {
  //     // If there are updated images in the array, use the first one
  //     const firstUpdatedImage = updatedImageArray[0];
  //     updatedImageArray.shift(); // Remove the first element from the array
  //     res.json({
  //       name: firstUpdatedImage.name,
  //       updatedImage: firstUpdatedImage.image,
  //     });
  //   } else {
  //     // If no updated images, provide default values
  //     const randomImageDoc = await EditedImage.aggregate([{ $sample: { size: 1 } }]);
  //     if (randomImageDoc.length > 0) {
  //       res.json({
  //         name: randomImageDoc[0].name,
  //         updatedImage: randomImageDoc[0].image,
  //       });
  //     } else {
  //       // If no randomImageDoc found, use default values
  //       res.json({
  //         name: "Random User",
  //         updatedImage: "https://example.com/random-image.jpg", // Replace with a URL to a random image
  //       });
  //     }
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Error retrieving updated image" });
  // }
  try{
    const randomImageDoc = await EditedImage.aggregate([{ $sample: { size: 1 } }]);
    if (randomImageDoc.length > 0) {
      res.json({
        name: randomImageDoc[0].name,
        updatedImage: randomImageDoc[0].image,
      });
  }}catch(error){
    console.log(error)
  }
});

// setInterval(async () => {
//   await edittheimg();
// }, 10000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
