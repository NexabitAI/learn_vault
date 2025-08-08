const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  deleteImageFromCloudinary,
} = require("../../helpers/cloudinary");
const Course = require("../../models/Course");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const result = await uploadMediaToCloudinary(
        req.file.path
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (e) {
      console.log(e);

      res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }
  }
);

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message:
        "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error deleting file",
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { imageId, courseId } = req.body;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Assest Id is required",
      });
    }

    await deleteImageFromCloudinary(imageId);

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { image: "" },
      { new: true }
    );
    if (updatedCourse) {
      console.log(
        "Course image updated successfully:",
        updatedCourse
      );
    } else {
      console.log("Course not found with the given ID.");
    }
    res.status(200).json({
      success: true,
      message:
        "Assest deleted successfully from cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error deleting file",
    });
  }
});

router.post(
  "/bulk-upload",
  upload.array("files", 10),
  async (req, res) => {
    try {
      const uploadPromises = req.files.map((fileItem) =>
        uploadMediaToCloudinary(fileItem.path)
      );

      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (event) {
      console.log(event);

      res.status(500).json({
        success: false,
        message: "Error in bulk uploading files",
      });
    }
  }
);

module.exports = router;
