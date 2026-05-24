const axios = require("axios");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTFhMjI2YWIyM2E0MzNiMTg0NjAzMiIsImVtYWlsIjoiZGVtb0B0dW5pc2lhdHJhdmVsLmNvbSIsImlhdCI6MTc3OTY0MzM2NCwiZXhwIjoxNzc5NjY0OTY0fQ.uEeYOrXtvShiHe1BcLMHGhnMPnw8LkX9ozYbSjpEHTY";
const userId = "6a11a226ab23a433b1846032";

async function run() {
  try {
    const res = await axios.put(`http://127.0.0.1:5000/users/${userId}`, {
      name: "Khaled Hamza Updated",
      bio: "new bio test",
      location: "new location test",
      interests: "art, books"
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("STATUS:", res.status);
    console.log("DATA:", res.data);
  } catch (error) {
    if (error.response) {
      console.log("ERROR STATUS:", error.response.status);
      console.log("ERROR DATA:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

run();
