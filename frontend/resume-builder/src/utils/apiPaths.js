export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",  // Signup
    LOGIN: "/api/auth/login",         // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    FORGOT_PASSWORD: "/api/auth/forgot-password", // Send reset email
    RESET_PASSWORD: (token) => `/api/auth/reset-password/${token}`, // Reset password with token
    VERIFY_OTP: "/api/auth/verify-otp",
    RESEND_OTP: "/api/auth/resend-otp",
  },

  RESUME: {
    CREATE: "/api/resume",             // POST - Create a new resume
    GET_ALL: "/api/resume",             // GET - Get all resumes of logged-in user
    GET_BY_ID: (id) => `/api/resume/${id}`, // GET - Get a specific resume
    UPDATE: (id) => `/api/resume/${id}`,    // PUT - Update a resume
    DELETE: (id) => `/api/resume/${id}`,    // DELETE - Delete a resume
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`, // PUT - Upload Thumbnail and Resume profile Images
    PARSE_PDF: "/api/resume/parse-pdf",
    GET_ATS_SCORE: (id) => `/api/resume/${id}/ats-score`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
