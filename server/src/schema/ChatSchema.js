const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatHistory: [
      {
        message: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
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
