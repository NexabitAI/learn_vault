import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import {
  imageDeleteService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const params = useParams();

  console.log(courseLandingFormData);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  function extractPublicId(url) {
    try {
      const parts = url.split("/");
      // Return the last part of the array
      const lastPart = parts[parts.length - 1];
      const withoutExtension = lastPart.split(".")[0];
      return withoutExtension;
    } catch (error) {
      console.error(
        "Error extracting public_id:",
        error.message
      );
      return null;
    }
  }
  console.log(params);
  async function handleDeleteImage() {
    const imageId = extractPublicId(
      courseLandingFormData.image
    );
    await imageDeleteService(imageId, params?.courseId);
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: "", // Reset the image field
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <>
            <img src={courseLandingFormData.image} />
            <Button
              className="text-sm tracking-wider font-bold px-8 mt-8"
              onClick={() => handleDeleteImage()}>
              Delete
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
