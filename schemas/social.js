const { required } = require("joi");
const { Schema, model } = require("mongoose");

const socialScheme = new Schema(
  {
    social_name: {
      type: String,
      required: true,
    },
    social_icon_file: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Social", socialScheme);