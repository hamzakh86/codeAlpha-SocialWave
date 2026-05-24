const axios = require("axios");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTFhMmQzMjIzOTI2YzdhZjlkYjdjMSIsImVtYWlsIjoidGVzdDZAZ21haWwuY29tIiwiaWF0IjoxNzc5NjQyOTU3LCJleHAiOjE3Nzk2NjQ1NTd9.3Xok5acHjaKP8gRVnnbNKHLJkvqF1oWed_0i2r8OMvo";
const userId = "6a11a2d3223926c7af9db7c1";

async function run() {
  try {
    const res = await axios.put(`https://codealpha-socialwave.onrender.com/users/${userId}`, {
      name: "test updated render",
      bio: "new bio render",
      location: "new location render",
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
