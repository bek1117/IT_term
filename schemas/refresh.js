const { Schema, model } = require("mongoose");

const refreshSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("RefreshToken", refreshSchema);
