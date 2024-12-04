require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const knex = require("knex");
const configOptions = require("../knexfile");
const db = knex(configOptions);

// **Note: Copy from the Google vision api document:
// https://cloud.google.com/vision/docs/base64?hl=en#using_client_libraries
function encodeImage(image) {
  // get the path of the image you want to access
  const imageFilePath = path.resolve(__dirname, `../public/images/${image}`);

  // read the image data
  const imageFile = fs.readFileSync(imageFilePath);

  // Convert the image data to a Buffer and encode it to base64 format.
  const base64ImageStr = Buffer.from(imageFile).toString("base64");
  return base64ImageStr;
}

const listImageController = async (req, res) => {
  // TODO: add you code here
};

const getImageController = async (req, res) => {
  // TODO: add you code here
};

const createImageController = async (req, res) => {
  try {
    // Google Vision API key is stored in env file
    const apiKey = process.env.API_KEY;

    // req.file exist after upload.single("imageFile") middleware is resolved
    const imageFileName = req.file.originalname;
    const base64ImageStr = encodeImage(imageFileName);

    // **Note: check out the document to see how to configure the request body of the google vision PAI
    // https://cloud.google.com/vision/docs/reference/rest/v1/AnnotateImageRequest
    request_body = {
      requests: [
        {
          image: {
            content: base64ImageStr, // this need to be base64 string
          },
          features: [
            {
              type: "LABEL_DETECTION",
            },
          ],
        },
      ],
    };

    // TODO: add you code here

    // **Note: call the Google Vision API, check out the official document below for reference:
    // https://cloud.google.com/vision/docs/request
  } catch (error) {
    res.status(500).send(`Error occurs. Error: ${error}`);
  }
};

module.exports = {
  listImageController,
  getImageController,
  createImageController,
};
