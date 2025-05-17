const { Schema, model } = require("mongoose");

const AdminScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_creator: {
      type: Boolean,
      default: false,
    },
    activation_link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Admin", AdminScheme);