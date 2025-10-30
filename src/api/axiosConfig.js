import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44389/api",
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/account/refresh")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await api.post("/account/refresh", { refreshToken });
        const { token: newToken, refreshToken: newRefreshToken } = res.data;
        // alert("newToken: " + newToken);
        // alert("newRefreshToken: " + newRefreshToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        onRefreshed(newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
