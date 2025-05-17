const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
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
    photo: {
      type: String,
      default: "https://example.com",
    },
    user_info: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
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

module.exports = model("User", UserSchema);
