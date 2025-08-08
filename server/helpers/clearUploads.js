const fs = require("fs");
const path = require("path");

const clearUploadFolder = () => {
  const uploadFolderPath = path.resolve("uploads"); // This points to the root folder's 'uploads'
  console.log(`Checking folder: ${uploadFolderPath}`);
  // Check if the uploads folder exists
  if (fs.existsSync(uploadFolderPath)) {
    // Read all files in the folder
    console.log("Upload folder found, reading files...");
    fs.readdir(uploadFolderPath, (err, files) => {
      if (err) {
        console.log("Error reading upload folder:", err);
        return;
      }

      // Loop through each file and delete it
      files.forEach((file) => {
        const filePath = path.join(uploadFolderPath, file);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(
              `Error deleting file: ${file}`,
              err
            );
          } else {
            console.log(`File deleted: ${file}`);
          }
        });
      });
    });
  } else {
    console.log("Upload folder does not exist.");
  }
};

// Schedule the function to run every 24 hours (86400000 milliseconds)

module.exports = { clearUploadFolder };
