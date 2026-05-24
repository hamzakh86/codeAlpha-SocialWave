import axios from "axios";

const DEFAULT_API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://codealpha-socialwave.onrender.com";
const BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const authInterceptor = (req) => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
};

const adminAuthInterceptor = (req) => {
  const accessToken = JSON.parse(localStorage.getItem("admin"))?.accessToken;
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
};

export const API = axios.create({
  baseURL: BASE_URL,
});

export const ADMIN_API = axios.create({
  baseURL: BASE_URL,
});

export const COMMUNITY_API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use(authInterceptor);
ADMIN_API.interceptors.request.use(adminAuthInterceptor);
COMMUNITY_API.interceptors.request.use((req) => {
  req.headers["Content-Type"] = "application/json";
  return authInterceptor(req);
});

export const handleApiError = async (error) => {
  try {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred.";
    const data = null;
    return { error: errorMessage, data };
  } catch (err) {
    throw new Error("An unexpected error occurred.");
  }
};
