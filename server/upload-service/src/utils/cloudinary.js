const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// Verify Cloudinary configuration
console.log("🌤️ Cloudinary Configuration:");
console.log("- Cloud Name:", process.env.cloud_name ? "✅ Set" : "❌ Missing");
console.log("- API Key:", process.env.api_key ? "✅ Set" : "❌ Missing");
console.log("- API Secret:", process.env.api_secret ? "✅ Set" : "❌ Missing");

const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

module.exports = { uploadMediaToCloudinary };
