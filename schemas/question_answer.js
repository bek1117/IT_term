const { Schema, model } = require("mongoose");

const questionAnswerSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expert_id: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      default: null,
    },
  },
  {
      timestamps: true,
      versionKey : false
  }
);

module.exports = model("QuestionAnswer", questionAnswerSchema);
