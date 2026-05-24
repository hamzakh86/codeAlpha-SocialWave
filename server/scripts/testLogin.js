const axios = require("axios");

async function run() {
  try {
    const res = await axios.post("http://127.0.0.1:5000/users/signin", {
      email: "demo@tunisiatravel.com",
      password: "password123"
    });
    console.log("STATUS:", res.status);
    console.log("ACCESS TOKEN:", res.data.accessToken);
    
    // Now decode and verify the new token using local SECRET
    const jwt = require("jsonwebtoken");
    const dotenv = require("dotenv");
    const path = require("path");
    dotenv.config({ path: path.join(__dirname, "../.env") });
    
    const decoded = jwt.verify(res.data.accessToken, process.env.SECRET);
    console.log("DECODED WITH LOCAL SECRET:", decoded);
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
