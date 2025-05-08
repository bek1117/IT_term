const Description = require("../models/description");
const error_handler = require("../utils/send.error.response");
const validate = require("../validation/description.validation");

const getAllDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find().populate("category_id");
    res.status(200).send({ data: descriptions });
  } catch (error) {
    error_handler(error, res);
  }
};

const getDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const description = await Description.findById(id).populate("category_id");
    if (!description) {
      return res.status(404).send({ message: "Description not found" });
    }
    res.status(200).send({ data: description });
  } catch (error) {
    error_handler(error, res);
  }
};

const createDescription = async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const newDescription = await Description.create(value);
    res.status(201).send({ data: newDescription });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const updatedDescription = await Description.findByIdAndUpdate(id, value);
    if (!updatedDescription) {
      return res.status(404).send({ message: "Description not found" });
    }
    res.status(200).send({ data: updatedDescription });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDescription = await Description.findByIdAndDelete(id);
    if (!deletedDescription) {
      return res.status(404).send({ message: "Description not found" });
    }
    res.status(200).send({ data: deletedDescription });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllDescriptions,
  getDescriptionById,
  createDescription,
  updateDescriptionById,
  deleteDescriptionById,
};
