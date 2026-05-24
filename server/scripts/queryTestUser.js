const mongoose = require("mongoose");

const dbUri = "mongodb+srv://khaledhamza251785_db_user:hamza013579@cluster0.zhpeohg.mongodb.net/test?appName=Cluster0";

async function run() {
  await mongoose.connect(dbUri);
  console.log("Connected");
  
  const tokenSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId
  }, { strict: false });
  const Token = mongoose.model("Token", tokenSchema);
  const tokens = await Token.find({});
  console.log("ALL TOKENS in DB:", JSON.stringify(tokens, null, 2));

  await mongoose.disconnect();
}

run().catch(console.error);
