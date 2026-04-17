import axios from "axios";

const BASE_URL = "https://codealpha-socialwave.onrender.com";

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
    // ✅ MODIFICATION ICI : Enlever "/users"
    const response = await API.post("/refresh-token", {  // ← Changement important
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
