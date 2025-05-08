const { Schema, model } = require("mongoose");

const dictScheme = new Schema(
  {
    term: {
      type: String,
      required: true,
      trim: true,
    },
    letter: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Dictionary", dictScheme);
