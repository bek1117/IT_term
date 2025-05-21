const Topic = require("../schemas/topic");
const mongoose = require("mongoose");
const error_handler = require("../utils/send.error.response");
const validate = require("../validation/topic.validation");

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().select("-__v");
    res.status(200).send({ data: topics });
  } catch (error) {
    error_handler(error, res);
  }
};

const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).send({ message: "Topic not found" });
    }
    res.status(200).send({ data: topic });
  } catch (error) {
    error_handler(error, res);
  }
};

const createTopic = async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ errors: error.details.map((d) => d.message) });
    }
    const topic = await Topic.create(value);
    res.status(201).send({ data: topic });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const topic = await Topic.findByIdAndUpdate(id, req.body, { new: true });
    if (!topic) {
      return res.status(404).send({ message: "Topic not found" });
    }
    res.status(200).send({ data: topic });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return res.status(404).send({ message: "Topic not found" });
    }
    res.status(200).send({ data: topic });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopicById,
  deleteTopicById,
};
