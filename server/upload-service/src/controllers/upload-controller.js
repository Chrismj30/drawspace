const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/media");

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No File Found!",
      });
    }

    const { originalname, mimetype, size, width, height } = req.file;
    const { userId } = req.user;

    const cloudinaryResult = await uploadMediaToCloudinary(req.file);

    const newlyCreatedMedia = new Media({
      userId,
      name: originalname,
      cloudinaryId: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      mimeType: mimetype,
      size,
      width,
      height,
    });

    await newlyCreatedMedia.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedMedia,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error creating asset",
    });
  }
};

const getAllMediasByUser = async (req, res) => {
  try {
    console.log("getAllMediasByUser - User ID:", req.user?.userId);
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }
    
    const medias = await Media.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    console.log("getAllMediasByUser - Found medias:", medias.length);

    res.status(200).json({
      success: true,
      data: medias,
    });
  } catch (e) {
    console.error("getAllMediasByUser Error:", e);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assets",
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

module.exports = { uploadMedia, getAllMediasByUser };
