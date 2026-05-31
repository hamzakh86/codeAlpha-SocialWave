const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
// Index composé unique : empêche les doublons et accélère les lookups
relationshipSchema.index({ follower: 1, following: 1 }, { unique: true });

// Index sur following seul pour les requêtes inverses (qui suit X ?)
relationshipSchema.index({ following: 1 });

module.exports = mongoose.model("Relationship", relationshipSchema);
