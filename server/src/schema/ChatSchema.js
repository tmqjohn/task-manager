const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatHistory: [
      {
        message: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
