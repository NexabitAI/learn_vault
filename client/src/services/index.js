import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";

export async function registerService(formData) {
  try {
    const { data } = await axiosInstance.post(
      "/auth/register",
      {
        ...formData,
        role: "user",
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      toast.error(
        error.response.data.message ||
          "Registration failed. Please try again."
      );
    } else if (error.request) {
      toast.error(
        "No response from the server. Please try again."
      );
    } else {
      toast.error(
        "An unexpected error occurred during registration."
      );
    }

    throw error;
  }
}

export async function loginService(formData) {
  try {
    const { data } = await axiosInstance.post(
      "/auth/login",
      formData
    );
    return data;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data);
      console.error("Error Response:", error.response.data);
      throw new Error(
        error.response.data.message || "Invalid credentials"
      );
    } else if (error.request) {
      console.error("No Response Received:", error.request);
      throw new Error(
        "No response from the server. Please try again."
      );
    } else {
      console.error("Error:", error.message);
      throw new Error(
        "An unexpected error occurred. Please try again."
      );
    }
  }
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get(
    "/auth/check-auth"
  );

  return data;
}

export async function mediaUploadService(
  formData,
  onProgressCallback
) {
  const { data } = await axiosInstance.post(
    "/media/upload",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    }
  );

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(
    `/media/delete/${id}`
  );

  return data;
}

export async function imageDeleteService(
  imageId,
  courseId
) {
  const { data } = await axiosInstance.delete(
    `/media/delete`,
    { data: { imageId, courseId } }
  );

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(
    `/instructor/course/get`
  );

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(
    `/instructor/course/add`,
    formData
  );

  return data;
}

export async function deleteCourseService(courseId) {
  const { data } = await axiosInstance.delete(
    `/instructor/course/delete/${courseId}`
  );

  return data;
}

export async function fetchInstructorCourseDetailsService(
  id
) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(
  id,
  formData
) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(
  formData,
  onProgressCallback
) {
  const { data } = await axiosInstance.post(
    "/media/bulk-upload",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgressCallback(percentCompleted);
      },
    }
  );

  return data;
}

export async function fetchStudentViewCourseListService(
  query
) {
  const { data } = await axiosInstance.get(
    `/student/course/get?${query}`
  );

  return data;
}

export async function fetchStudentViewCourseDetailsService(
  courseId
) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(
  courseId,
  studentId
) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(
    `/student/order/create`,
    formData
  );

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(
    `/student/order/capture`,
    {
      paymentId,
      payerId,
      orderId,
    }
  );

  return data;
}

export async function fetchStudentBoughtCoursesService(
  studentId
) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(
  userId,
  courseId
) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(
  userId,
  courseId,
  lectureId
) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(
  userId,
  courseId
) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
