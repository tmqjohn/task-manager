const mongoose = require("mongoose");

const ProjectSchema = new mongoose(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    owner: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // groupTask: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Group",
    //   },
    // ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
