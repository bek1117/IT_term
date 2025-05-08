const Dictionary = require("../schemas/dictionary");
const error_handler = require("../utils/send.error.response");
const Joi = require("joi");
const { dict_validation } = require("../validation/dict.validation");

const addDict = async (req, res) => {
  try {
    const { error } = dict_validation(req.body);
    if (error) {
      error_handler(error, res);
    }
    const { term } = req.body;
    const newDict = await Dictionary.create({ term, letter: term[0] });
    res.status(201).send({ messege: "New term added", data: newDict });
  } catch (error) {
    error_handler(error, res);
  }
};

const getAllDict = async (req, res) => {
  try {
    const data = await Dictionary.find().select("term letter -_id");
    res.status(200).send(data);
  } catch (error) {
    error_handler(error, res);
  }
};

const getDictByLetter = async (req, res) => {
  try {
    const { letter } = req.params;
    const data = await Dictionary.find({ letter }).select("term");
    res.status(200).send(data);
  } catch (error) {
    error_handler(error, res);
  }
};

const getDictById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Dictionary.findById(id).select("term letter -_id");
    if (!data) {
      return res.status(404).send({ messege: "Term not found" });
    }
    res.status(200).send(data);
  } catch (error) {
    error_handler(error, res);
  }
};

const updateDictById = async (req, res) => {
  try {
    const { id } = req.params;
    const { term } = req.body;
    const data = await Dictionary.findByIdAndUpdate(id, { term });
    if (!data) {
      return res.status(404).send({ messege: "Term not found" });
    }
    res.status(200).send({ messege: "Term updated", data });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteDictById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Dictionary.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send({ messege: "Term not found" });
    }
    res.status(200).send({ messege: "Term deleted", data });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  addDict,
  getAllDict,
  getDictByLetter,
  getDictById,
  updateDictById,
  deleteDictById,
};
