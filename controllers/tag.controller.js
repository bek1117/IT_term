const Tag = require("../schemas/tag");
const mongoose = require("mongoose");
const error_handler = require("../utils/send.error.response");
const { tagValidation } = require("../validation/tag.validation");

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).send({ data: tags });
  } catch (error) {
    error_handler(error, res);
  }
};

const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(403).send({ message: "Invalid Id" });

    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).send({ message: "Tag not found" });

    res.status(200).send({ data: tag });
  } catch (error) {
    error_handler(error, res);
  }
};

const createTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error)
      return res
        .status(400)
        .send({ errors: error.details.map((d) => d.message) });

    const tag = await Tag.create(value);
    res.status(201).send({ data: tag });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(403).send({ message: "Invalid Id" });

    const tag = await Tag.findByIdAndUpdate(id, req.body);
    if (!tag) return res.status(404).send({ message: "Tag not found" });

    res.status(200).send({ data: tag });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(403).send({ message: "Invalid Id" });

    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) return res.status(404).send({ message: "Tag not found" });

    res.status(200).send({ data: tag });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
