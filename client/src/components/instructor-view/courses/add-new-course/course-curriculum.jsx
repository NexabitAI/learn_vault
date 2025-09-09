// src/pages/instructor/parts/CourseCurriculum.jsx (adjust path as needed)
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card className="border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow)]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-[hsl(var(--border))]">
        <CardTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Create Course Curriculum
        </CardTitle>

        <div className="flex items-center gap-2">
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            asChild
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <label htmlFor="bulk-media-upload" className="inline-flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </label>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
            onClick={handleNewLecture}
            className="min-w-[140px]"
          >
            Add Lecture
          </Button>

          {mediaUploadProgress ? (
            <div className="flex-1 min-w-[240px]">
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={curriculumItem?.public_id || `lecture-${index}`}
              className="
                border border-[hsl(var(--border))]
                bg-[hsl(var(--card))]
                rounded-[var(--radius)]
                p-5
                shadow-sm
                hover:shadow-md
                transition-shadow
              "
            >
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="font-semibold text-[hsl(var(--foreground))] min-w-[110px]">
                  Lecture {index + 1}
                </h3>

                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="w-full sm:max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label
                    htmlFor={`freePreview-${index + 1}`}
                    className="text-[hsl(var(--foreground))]"
                  >
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-wrap items-start gap-3">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleReplaceVideo(index)}>
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        variant="destructive"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleSingleLectureUpload(event, index)}
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
