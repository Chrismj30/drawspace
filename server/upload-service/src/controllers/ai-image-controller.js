const axios = require("axios");
const FormData = require("form-data");
const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/media");

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_HOST = "https://api.stability.ai";

const generateImageFromAIAndUploadToDB = async (req, res) => {
  const prompt = req.body.prompt;
  const userId = req.user.userId;

  console.log("AI Image Generation Request:", { prompt, userId });

  if (!STABILITY_API_KEY) {
    console.error("STABILITY_API_KEY is not set");
    return res.status(500).json({
      success: false,
      message: "AI service configuration error",
    });
  }

  try {
    console.log("Making request to Stability AI v2beta API...");
    
    // Create form data for the new v2beta API
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');
    
    const response = await axios.post(
      `${STABILITY_API_HOST}/v2beta/stable-image/generate/core`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Accept: "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        responseType: 'arraybuffer'
      }
    );

    console.log("Stability AI response received, status:", response.status);
    console.log("Response headers:", response.headers);

    // The v2beta API returns the image directly as binary data when Accept: application/json is used
    // But we want the binary data, so let's handle it properly
    let imageBuffer;
    
    if (response.headers['content-type']?.includes('application/json')) {
      // If JSON response, extract base64 data
      const jsonResponse = JSON.parse(response.data.toString());
      if (jsonResponse.image) {
        imageBuffer = Buffer.from(jsonResponse.image, 'base64');
      } else {
        throw new Error("No image data in JSON response");
      }
    } else {
      // Direct binary response
      imageBuffer = Buffer.from(response.data);
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("No image data received from Stability AI");
    }

    console.log("Image buffer size:", imageBuffer.length);

    const file = {
      buffer: imageBuffer,
      originalName: `ai-generated-${Date.now()}.png`,
      mimetype: "image/png",
      size: imageBuffer.length,
      width: 1024,
      height: 1024,
    };

    console.log("Uploading to Cloudinary...");
    const cloudinaryResult = await uploadMediaToCloudinary(file);
    console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

    const newlyCreatedMedia = new Media({
      userId,
      name: `AI Generated ${prompt.substring(0, 50)}${
        prompt.length > 50 ? "..." : ""
      }}`,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimeType: "image/png",
      size: imageBuffer.length,
      width: 1024,
      height: 1024,
    });

    await newlyCreatedMedia.save();
    console.log("Media saved to database:", newlyCreatedMedia._id);

    return res.status(201).json({
      success: true,
      data: newlyCreatedMedia,
      prompt,
      message: "AI image generated and uploaded to DB successfully",
    });
  } catch (e) {
    console.error("AI Image Generation Error:", {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      data: e.response?.data,
      config: e.config ? {
        url: e.config.url,
        method: e.config.method,
        headers: e.config.headers
      } : null
    });

    // Check if it's an API error
    if (e.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message: "AI service authentication failed. Please check API key.",
      });
    }

    if (e.response?.status === 429) {
      return res.status(500).json({
        success: false,
        message: "AI service rate limit exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: e.response?.data?.message || e.message || "AI image generation failed! Please try again",
    });
  }
};

module.exports = { generateImageFromAIAndUploadToDB };
