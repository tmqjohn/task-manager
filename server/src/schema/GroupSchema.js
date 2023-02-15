const mongoose = require("mongoose");

const GroupSchema = new mongoose.Model(
  {
    title: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", GroupSchema);
