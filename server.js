// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
// import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const dbHost = process.env.DB_Host;

const app = express();
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
let updatedImageArray2 = [];
let updatedImageArray3 = [];
let updatedImageArray4 = [];

// Define Image schema and model
const imageSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const Image = mongoose.model("Image", imageSchema);

const imageSchema2 = new mongoose.Schema({
  name: String,
  image: String,
});
const Image2 = mongoose.model("Image2", imageSchema2);

const imageSchema3 = new mongoose.Schema({
  name: String,
  image: String,
});
const Image3 = mongoose.model("Image3", imageSchema3);

const imageSchema4= new mongoose.Schema({
  name: String,
  image: String,
});
const Image4 = mongoose.model("Image4", imageSchema4);

const editedimageSchema = new mongoose.Schema({
  name: String,
  image: String,
});
const EditedImage = mongoose.model("EditedImage", editedimageSchema);

const editedimageSchema2 = new mongoose.Schema({
  name: String,
  image: String,
});
const EditedImage2 = mongoose.model("EditedImage2", editedimageSchema2);

const editedimageSchema3 = new mongoose.Schema({
  name: String,
  image: String,
});
const EditedImage3 = mongoose.model("EditedImage3", editedimageSchema3);

const editedimageSchema4 = new mongoose.Schema({
  name: String,
  image: String,
});
const EditedImage4 = mongoose.model("EditedImage4", editedimageSchema4);

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

// image upload for url2
app.post("/upload2", upload.single("image"), async (req, res) => {
  try {
    const { name, image } = req.body; // Destructure name and image from the request body
    const newImage = new Image2({ name, image }); // Create a new Image instance
    await newImage.save(); // Save the new image to the collection
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

//image upload for url3
app.post("/upload3", upload.single("image"), async (req, res) => {
  try {
    const { name, image } = req.body; // Destructure name and image from the request body
    const newImage = new Image3({ name, image }); // Create a new Image instance
    await newImage.save(); // Save the new image to the collection
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

//image upload for url3
app.post("/upload4", upload.single("image"), async (req, res) => {
  try {
    const { name, image } = req.body; // Destructure name and image from the request body
    const newImage = new Image4({ name, image }); // Create a new Image instance
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
const storeUpdatedImage2 = (name, image) => {
  updatedImageArray2.push({ name, image });
};
const storeUpdatedImage3 = (name, image) => {
  updatedImageArray3.push({ name, image });
};
const storeUpdatedImage4 = (name, image) => {
  updatedImageArray4.push({ name, image });
};

const edittheimg = async () => {
  try {
    //for db1 and url1
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
      clientsecretkey: "RandomGeneratedPassword@",
    };
    const response = await axios.post(
      "https://realmepython.stuns.org/extract_face",
      {
        Image_Name: username,
        Image_Base64: base64Image,
      },
      { headers }
    );

    console.log(response.data, "response from sachin");
    if (response.status === 200) {
      const updatedImage = `data:image/jpeg;base64,${response.data}`; // Assuming the response structure is correct
      const result = await cloudinary.uploader.upload(updatedImage);
      console.log(result, "result from cloudinary");
      const editedImage = new EditedImage({
        name: username,
        image: result.secure_url,
      });
      await editedImage.save();
      await Image.deleteOne({ _id: image._id }); // Properly delete the specific image
      console.log("Image processed and updated.");
      // Store the updated image and name in the array
      storeUpdatedImage(username, result.secure_url);
    } else {
      console.log("Server responded with an error:", response.status);
    }
  } catch (error) {
    await Image.deleteOne({}); // Delete the document if response is 500 and details is empty
    console.log(error);
  }
};


const edittheimg2 = async () => {
  try {
    //for db2 and url2
    const image = await Image2.findOne();
    if (!image) {
      console.log("No image data to process.");
      return;
    }
    const username = image.name;
    const imageDataParts = image.image.split(","); // Split at the comma
    const base64Image = imageDataParts[1];
    const headers = {
      userid: "Event",
      clientsecretkey: "RandomGeneratedPassword@",
    };
    const response = await axios.post(
      "https://realmepython.stuns.org/extract_face",
      {
        Image_Name: username,
        Image_Base64: base64Image,
      },
      { headers }
    );

    console.log(response.data, "response from sachin");
    if (response.status === 200) {
      const updatedImage = `data:image/jpeg;base64,${response.data}`; // Assuming the response structure is correct
      const result = await cloudinary.uploader.upload(updatedImage);
      console.log(result, "result from cloudinary");
      const editedImage = new EditedImage2({
        name: username,
        image: result.secure_url,
      });
      await editedImage.save();
      await Image2.deleteOne({ _id: image._id }); // Properly delete the specific image
      console.log("Image processed and updated.");
      // Store the updated image and name in the array
      storeUpdatedImage2(username, result.secure_url);
    } else {
      console.log("Server responded with an error:", response.status);
    }
  } catch (error) {
    await Image2.deleteOne({}); // Delete the document if response is 500 and details is empty
    console.log(error);
  }
};

const edittheimg3 = async () => {
  try {
    //for db2 and url2
    const image = await Image3.findOne();
    if (!image) {
      console.log("No image data to process.");
      return;
    }
    const username = image.name;
    const imageDataParts = image.image.split(","); // Split at the comma
    const base64Image = imageDataParts[1];
    const headers = {
      userid: "Event",
      clientsecretkey: "RandomGeneratedPassword@",
    };
    const response = await axios.post(
      "https://realmepython.stuns.org/extract_face",
      {
        Image_Name: username,
        Image_Base64: base64Image,
      },
      { headers }
    );

    console.log(response.data, "response from sachin");
    if (response.status === 200) {
      const updatedImage = `data:image/jpeg;base64,${response.data}`; // Assuming the response structure is correct
      const result = await cloudinary.uploader.upload(updatedImage);
      console.log(result, "result from cloudinary");
      const editedImage = new EditedImage3({
        name: username,
        image: result.secure_url,
      });
      await editedImage.save();
      await Image3.deleteOne({ _id: image._id }); // Properly delete the specific image
      console.log("Image processed and updated.");
      // Store the updated image and name in the array
      storeUpdatedImage3(username, result.secure_url);
    } else {
      console.log("Server responded with an error:", response.status);
    }
  } catch (error) {
    await Image3.deleteOne({}); // Delete the document if response is 500 and details is empty
    console.log(error);
  }
};

const edittheimg4 = async () => {
  try {
    //for db2 and url2
    const image = await Image4.findOne();
    if (!image) {
      console.log("No image data to process.");
      return;
    }
    const username = image.name;
    const imageDataParts = image.image.split(","); // Split at the comma
    const base64Image = imageDataParts[1];
    const headers = {
      userid: "Event",
      clientsecretkey: "RandomGeneratedPassword@",
    };
    const response = await axios.post(
      "https://realmepython.stuns.org/extract_face",
      {
        Image_Name: username,
        Image_Base64: base64Image,
      },
      { headers }
    );

    console.log(response.data, "response from sachin");
    if (response.status === 200) {
      const updatedImage = `data:image/jpeg;base64,${response.data}`; // Assuming the response structure is correct
      const result = await cloudinary.uploader.upload(updatedImage);
      console.log(result, "result from cloudinary");
      const editedImage = new EditedImage({
        name: username,
        image: result.secure_url,
      });
      await editedImage.save();
      await Image4.deleteOne({ _id: image._id }); // Properly delete the specific image
      console.log("Image processed and updated.");
      // Store the updated image and name in the array
      storeUpdatedImage4(username, result.secure_url);
    } else {
      console.log("Server responded with an error:", response.status);
    }
  } catch (error) {
    await Image4.deleteOne({}); // Delete the document if response is 500 and details is empty
    console.log(error);
  }
};


// Define a route for the GET API
app.get("/get-updated-image", async (req, res) => {
  try {
    if (updatedImageArray.length > 0) {
      // If there are updated images in the array, use the first one
      const firstUpdatedImage = updatedImageArray[0];
      updatedImageArray.shift(); // Remove the first element from the array
      res.json({
        name: firstUpdatedImage.name,
        updatedImage: firstUpdatedImage.image,
      });
    } else {
      // If no updated images, provide default values
      const randomImageDoc = await EditedImage.aggregate([{ $sample: { size: 1 } }]);
      if (randomImageDoc.length > 0) {
        res.json({
          name: randomImageDoc[0].name,
          updatedImage: randomImageDoc[0].image,
        });
      } else {
        // If no randomImageDoc found, use default values
        res.json({
          name: "Ankita",
          updatedImage:
            "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvisiontechindia.com%2Fwp-content%2Fuploads%2F2023%2F05%2Fimages-2023-05-27T110047.252.jpeg&tbnid=jl7jWztSjfTaoM&vet=12ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs..i&imgrefurl=https%3A%2F%2Fvisiontechindia.com%2Fcute-simple-girl-pic.html&docid=YXFVOwqtB_k4HM&w=495&h=619&q=girls%20image&ved=2ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs", // Replace with a URL to a random image
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving updated image" });
  }
});


app.get("/get-updated-image2", async (req, res) => {
  try {
    if (updatedImageArray2.length > 0) {
      // If there are updated images in the array, use the first one
      const firstUpdatedImage = updatedImageArray2[0];
      updatedImageArray2.shift(); // Remove the first element from the array
      res.json({
        name: firstUpdatedImage.name,
        updatedImage: firstUpdatedImage.image,
      });
    } else {
      // If no updated images, provide default values
      const randomImageDoc = await EditedImage2.aggregate([{ $sample: { size: 1 } }]);
      if (randomImageDoc.length > 0) {
        res.json({
          name: randomImageDoc[0].name,
          updatedImage: randomImageDoc[0].image,
        });
      } else {
        // If no randomImageDoc found, use default values
        res.json({
          name: "Ankita",
          updatedImage:
            "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvisiontechindia.com%2Fwp-content%2Fuploads%2F2023%2F05%2Fimages-2023-05-27T110047.252.jpeg&tbnid=jl7jWztSjfTaoM&vet=12ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs..i&imgrefurl=https%3A%2F%2Fvisiontechindia.com%2Fcute-simple-girl-pic.html&docid=YXFVOwqtB_k4HM&w=495&h=619&q=girls%20image&ved=2ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs", // Replace with a URL to a random image
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving updated image" });
  }
});

app.get("/get-updated-image3", async (req, res) => {
  try {
    if (updatedImageArray3.length > 0) {
      // If there are updated images in the array, use the first one
      const firstUpdatedImage = updatedImageArray3[0];
      updatedImageArray3.shift(); // Remove the first element from the array
      res.json({
        name: firstUpdatedImage.name,
        updatedImage: firstUpdatedImage.image,
      });
    } else {
      // If no updated images, provide default values
      const randomImageDoc = await EditedImage3.aggregate([{ $sample: { size: 1 } }]);
      if (randomImageDoc.length > 0) {
        res.json({
          name: randomImageDoc[0].name,
          updatedImage: randomImageDoc[0].image,
        });
      } else {
        // If no randomImageDoc found, use default values
        res.json({
          name: "Ankita",
          updatedImage:
            "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvisiontechindia.com%2Fwp-content%2Fuploads%2F2023%2F05%2Fimages-2023-05-27T110047.252.jpeg&tbnid=jl7jWztSjfTaoM&vet=12ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs..i&imgrefurl=https%3A%2F%2Fvisiontechindia.com%2Fcute-simple-girl-pic.html&docid=YXFVOwqtB_k4HM&w=495&h=619&q=girls%20image&ved=2ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs", // Replace with a URL to a random image
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving updated image" });
  }
  
});


app.get("/get-updated-image4", async (req, res) => {
  try {
    if (updatedImageArray3.length > 0) {
      // If there are updated images in the array, use the first one
      const firstUpdatedImage = updatedImageArray3[0];
      updatedImageArray3.shift(); // Remove the first element from the array
      res.json({
        name: firstUpdatedImage.name,
        updatedImage: firstUpdatedImage.image,
      });
    } else {
      // If no updated images, provide default values
      const randomImageDoc = await EditedImage3.aggregate([{ $sample: { size: 1 } }]);
      if (randomImageDoc.length > 0) {
        res.json({
          name: randomImageDoc[0].name,
          updatedImage: randomImageDoc[0].image,
        });
      } else {
        // If no randomImageDoc found, use default values
        res.json({
          name: "Ankita",
          updatedImage:
            "https://www.google.com/imgres?imgurl=https%3A%2F%2Fvisiontechindia.com%2Fwp-content%2Fuploads%2F2023%2F05%2Fimages-2023-05-27T110047.252.jpeg&tbnid=jl7jWztSjfTaoM&vet=12ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs..i&imgrefurl=https%3A%2F%2Fvisiontechindia.com%2Fcute-simple-girl-pic.html&docid=YXFVOwqtB_k4HM&w=495&h=619&q=girls%20image&ved=2ahUKEwiM_cfPlPqAAxVba2wGHfdyCmQQMygcegQIARBs", // Replace with a URL to a random image
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving updated image" });
  }
});

setInterval(async () => {
  await edittheimg();
  await edittheimg2();
  await edittheimg3();
  await edittheimg4();

}, 12000);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
