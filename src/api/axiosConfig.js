import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44389/api", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if access token expired and request not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Call refresh endpoint
          const res = await api.post("/account/refresh", refreshToken);
          const { token: newToken, refreshToken: newRefreshToken } = res.data;

          // Update tokens in localStorage
          localStorage.setItem("token", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request with new access token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError);
          // Optionally, redirect to login page
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
