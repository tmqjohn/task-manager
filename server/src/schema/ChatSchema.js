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
        date: {
          type: String,
        },
        time: {
          type: String,
        },
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
