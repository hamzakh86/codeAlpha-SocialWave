const axios = require("axios");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTFhMjI2YWIyM2E0MzNiMTg0NjAzMiIsImVtYWlsIjoidGVzdDZAZ21haWwuY29tIiwiaWF0IjoxNzc5NjQzM2Y5LCJleHAiOjE3Nzk2NjQ5OTl9.9Wk2L7d1D3mX6K4aR2s1YnBvO1BsUzJwOHlhU2pwRUhUWQ";
const userId = "6a11a226ab23a433b1846032";

async function run() {
  try {
    // Get fresh token first
    const loginRes = await axios.post("http://127.0.0.1:5000/users/signin", {
      email: "demo@tunisiatravel.com",
      password: "password123"
    });
    const freshToken = loginRes.data.accessToken;

    const formData = new FormData();
    formData.append("name", "Khaled Hamza Form");
    formData.append("bio", "bio via form");
    formData.append("location", "loc via form");
    formData.append("interests", "art, design");

    const res = await axios.put(`http://127.0.0.1:5000/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${freshToken}`
      }
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", res.data);
  } catch (error) {
    if (error.response) {
      console.log("ERROR STATUS:", error.response.status);
      console.log("ERROR DATA:", error.response.data);
    } else {
      console.error(error);
    }
  }
}

run();
