const { Schema, model } = require("mongoose");

const DescTopicScheme = new Schema({
  desc_id: {
    type: Schema.Types.ObjectId,
    ref: "Description",
    required: true,
  },
  dict_id: {
    type: Schema.Types.ObjectId,
    ref: "Dictionary",
    required: true,
  },
});

module.exports = model("DescTopic", DescTopicScheme);