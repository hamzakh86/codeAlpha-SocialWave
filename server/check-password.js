const bcrypt = require("bcrypt");

const hash = "$2b$10$qWTPxTx9n/rt7E5ivUWwzOuIUU.eTOuXy4Q5uW.O4CexJbPOcEZe2";

const commonPasswords = [
  "admin123",
  "admin",
  "password123",
  "123456",
  "password",
  "admin@123",
  "12345678",
  "adminadmin",
  "socialwave",
  "socialwave123"
];

async function checkPasswords() {
  console.log("Checking common passwords against the hash...\n");
  let found = false;
  
  for (const pwd of commonPasswords) {
    const isMatch = await bcrypt.compare(pwd, hash);
    if (isMatch) {
      console.log(`🎉 MATCH FOUND!`);
      console.log(`Password is: "${pwd}"`);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log("❌ No match found in the common passwords list.");
    console.log("You can change the password to a new one (e.g. 'admin123') by running the admin creation script.");
  }
}

checkPasswords();
