const Synonym = require("../schemas/synonym");
const mongoose = require("mongoose");
const error_handler = require("../utils/send.error.response");
const { synonymValidation } = require("../validation/synonym.validation");

const getAllSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find().populate("dict_id desc_id");
    res.status(200).send({ data: synonyms });
  } catch (error) {
    error_handler(error, res);
  }
};

const getSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const synonym = await Synonym.findById(id).populate("dict_id desc_id");
    if (!synonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    res.status(200).send({ data: synonym });
  } catch (error) {
    error_handler(error, res);
  }
};

const createSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res
        .status(400)
        .send({ errors: error.details.map((d) => d.message) });
    }

    const synonym = await Synonym.create(value);
    res.status(201).send({ data: synonym });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res
        .status(400)
        .send({ errors: error.details.map((d) => d.message) });
    }

    const synonym = await Synonym.findByIdAndUpdate(id, value);
    if (!synonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    res.status(200).send({ data: synonym });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }

    const synonym = await Synonym.findByIdAndDelete(id);
    if (!synonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    res.status(200).send({ message: "Deleted successfully", data: synonym });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllSynonyms,
  getSynonymById,
  createSynonym,
  updateSynonymById,
  deleteSynonymById,
};
