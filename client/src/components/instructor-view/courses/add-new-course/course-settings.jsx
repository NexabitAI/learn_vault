// src/pages/instructor/parts/CourseSettings.jsx (adjust path as needed)
import React, { useContext } from "react";
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { imageDeleteService, mediaUploadService } from "@/services";
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

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files?.[0];
    if (!selectedImage) return;

    const imageFormData = new FormData();
    imageFormData.append("file", selectedImage);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        imageFormData,
        setMediaUploadProgressPercentage
      );
      if (response?.success) {
        setCourseLandingFormData({
          ...courseLandingFormData,
          image: response.data.url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  // Naive public_id extractor (works for "…/filename.ext")
  function extractPublicId(url) {
    try {
      const last = url.split("/").pop() || "";
      return last.split(".")[0] || null;
    } catch {
      return null;
    }
  }

  async function handleDeleteImage() {
    const imageId = extractPublicId(courseLandingFormData.image);
    if (!imageId) return;
    try {
      await imageDeleteService(imageId, params?.courseId);
      setCourseLandingFormData({ ...courseLandingFormData, image: "" });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]">
      <CardHeader className="border-b border-[hsl(var(--border))]">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Course Settings
        </CardTitle>
      </CardHeader>

      <div className="p-4" aria-busy={mediaUploadProgress || undefined}>
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>

      <CardContent className="pt-0">
        {courseLandingFormData?.image ? (
          <div className="flex flex-col gap-4">
            <div
              className="
                overflow-hidden rounded-[var(--radius)]
                border border-[hsl(var(--border))]
                bg-[hsl(var(--card))]
                max-w-[560px]
              "
            >
              <img
                src={courseLandingFormData.image}
                alt="Course cover"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                className="cursor-pointer"
                title="Upload a different image"
              >
                <label>
                  <Input
                    onChange={handleImageUploadChange}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  Change Image
                </label>
              </Button>

              <Button
                onClick={handleDeleteImage}
                variant="destructive"
                className="text-sm tracking-wider font-semibold px-6"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-[560px]">
            <Label htmlFor="course-image">Upload Course Image</Label>
            <Input
              id="course-image"
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="
                bg-[hsl(var(--card))]
                text-[hsl(var(--foreground))]
                border-[hsl(var(--border))]
                rounded-[var(--radius)]
              "
            />
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Recommended: 1280×720 (JPG or PNG). Large files may take longer to upload.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
