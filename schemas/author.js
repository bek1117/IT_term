  const { Schema, model } = require("mongoose");

  const AuthorScheme = new Schema(
    {
      first_name: {
        type: String,
        required: true,
        trim: true,
      },
      last_name: {
        type: String,
        required: true,
        trim: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      info: {
        type: String,
        trim: true,
      },
      position: {
        type: String,
        required: true,
        trim: true,
      },
      photo: {
        type: String,
      },
      is_expert: {
        type: Boolean,
        required: true,
      },
      is_active: {
        type: Boolean,
        required: true,
        default: false,
      },
      activation_link: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  module.exports = model("Author", AuthorScheme);