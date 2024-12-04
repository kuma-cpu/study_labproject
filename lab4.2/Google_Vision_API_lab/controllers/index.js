require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const knex = require("knex");
const configOptions = require("../knexfile");
const db = knex(configOptions);

function encodeImage(image) {
  const imageFilePath = path.resolve(__dirname, `../public/images/${image}`);
  const imageFile = fs.readFileSync(imageFilePath);
  const base64ImageStr = Buffer.from(imageFile).toString("base64");
  return base64ImageStr;
}

const listImageController = async (req, res) => {
  try {
    const images = await db("image").select("*"); // Fetch all images from the database
    res.json(images);
  } catch (error) {
    res.status(500).send(`Error fetching images: ${error}`);
  }
};

const getImageController = async (req, res) => {
  const { id } = req.params; // Extract ID from request parameters
  try {
    const image = await db("image").where({ id }).first(); // Fetch image by ID
    if (!image) {
      return res.status(404).send("Image not found");
    }
    res.json(image);
  } catch (error) {
    res.status(500).send(`Error fetching image: ${error}`);
  }
};

const createImageController = async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const imageFileName = req.file.originalname;
    const base64ImageStr = encodeImage(imageFileName);

    const request_body = {
      requests: [
        {
          image: {
            content: base64ImageStr,
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 10, // Adjust max results as needed
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      request_body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const labels = response.data.responses[0].labelAnnotations; // Extract detected labels
    const detectedLabels = labels.map(label => label.description).join(", "); // Join labels into a string

    // Store the image info in the database
    await db("image").insert({
      name: imageFileName,
      detected_label: detectedLabels,
    });

    res.status(201).json({ message: "Image processed successfully", labels: detectedLabels });
  } catch (error) {
    res.status(500).send(`Error occurs. Error: ${error}`);
  }
};

module.exports = {
  listImageController,
  getImageController,
  createImageController,
};
