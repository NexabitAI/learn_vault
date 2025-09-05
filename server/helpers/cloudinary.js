const cloudinary = require("cloudinary").v2;

//configure with env data
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Always use HTTPS secure URL
    return {
      public_id: result.public_id,
      url: result.secure_url,   // ✅ force HTTPS
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to cloudinary");
  }
};

// const deleteMediaFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to delete assest from cloudinary");
//   }
// };
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "video", // Explicitly set to "video"
      }
    );

    if (result.result == "ok") {
      console.log(
        `Succeded to delete video with public_id: ${publicId}`
      );
    }

    if (result.result !== "ok") {
      throw new Error(
        `Failed to delete video with public_id: ${publicId}`
      );
    }

    console.log("Deletion Result:", result);
    return result;
  } catch (error) {
    console.error(
      "Error deleting video from Cloudinary:",
      error
    );
    throw new Error(
      "Failed to delete video from Cloudinary"
    );
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image", // Explicitly set to "video"
      }
    );

    if (result.result == "ok") {
      console.log(
        `Succeded to delete image with public_id: ${publicId}`
      );
    }

    if (result.result !== "ok") {
      throw new Error(
        `Failed to delete image with public_id: ${publicId}`
      );
    }

    console.log("Deletion Result:", result);
    return result;
  } catch (error) {
    console.error(
      "Error deleting image from Cloudinary:",
      error
    );
    throw new Error(
      "Failed to delete image from Cloudinary"
    );
  }
};
module.exports = {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  deleteImageFromCloudinary,
};
