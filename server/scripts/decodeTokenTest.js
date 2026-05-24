const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTFhMmQzMjIzOTI2YzdhZjlkYjdjMSIsImVtYWlsIjoidGVzdDZAZ21haWwuY29tIiwiaWF0IjoxNzc5NjQyOTU3LCJleHAiOjE3Nzk2NjQ1NTd9.3Xok5acHjaKP8gRVnnbNKHLJkvqF1oWed_0i2r8OMvo";

console.log("SECRET:", process.env.SECRET);
try {
  const decoded = jwt.verify(token, process.env.SECRET);
  console.log("DECODED SUCCESS:", decoded);
} catch (e) {
  console.log("VERIFY FAILED:", e.message);
  try {
    const decodedNoVerify = jwt.decode(token);
    console.log("DECODED NO VERIFY:", decodedNoVerify);
  } catch (err) {
    console.log("DECODE FAILED:", err.message);
  }
}
