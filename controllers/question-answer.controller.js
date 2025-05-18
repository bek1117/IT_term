const QA = require("../schemas/question_answer");
const error_handler = require("../utils/send.error.response");
const validate = require("../validation/question-answer");

const getAllQAs = async (req, res) => {
  try {
    const q_a = await QA.find().populate("user_id expert_id");
    res.status(200).send({ data: q_a });
  } catch (error) {
    error_handler(error, res);
  }
};

const getQAById = async (req, res) => {
  try {
    const { id } = req.params;
    const qa = await QA.findById(id).populate("user_id expert_id");
    if (!qa) {
      return res.status(404).send({ message: "Not found" });
    }
    res.status(200).send({ data: qa });
  } catch (error) {
    error_handler(error, res);
  }
};

const createQA = async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const newQA = await QA.create(value);
    res.status(201).send({ data: newQA });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateQAById = async (req, res) => {
  try {
    const { id } = req.params;
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const updatedQA = await QA.findByIdAndUpdate(id, value, { new: true });
    if (!updatedQA) {
      return res.status(404).send({ message: "QA not found" });
    }
    res.status(200).send({ data: updatedQA });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteQAById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQA = await QA.findByIdAndDelete(id);
    if (!deletedQA) {
      return res.status(404).send({ message: "QA not found" });
    }
    res.status(200).send({messege : "Deleted successfully"});
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllQAs,
  getQAById,
  createQA,
  updateQAById,
  deleteQAById,
};
