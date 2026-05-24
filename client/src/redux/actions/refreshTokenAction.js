import axios from "axios";

const DEFAULT_API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://codealpha-socialwave.onrender.com";
const BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const accessToken = JSON.parse(localStorage.getItem("profile"))?.accessToken;
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

export const refreshTokenAction = (refreshToken) => async (dispatch) => {
  try {
    const response = await API.post("/refresh-token", {
      refreshToken,
    });
    const profile = JSON.parse(localStorage.getItem("profile"));
    const payload = response.data;
    localStorage.setItem("profile", JSON.stringify({ ...profile, ...payload }));
    dispatch({
      type: "REFRESH_TOKEN_SUCCESS",
      payload: payload,
    });
  } catch (error) {
    localStorage.removeItem("profile");
    dispatch({
      type: "REFRESH_TOKEN_FAIL",
      payload: error.response?.data || "Token refresh failed",
    });
  }
};
