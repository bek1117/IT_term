const Social = require("../schemas/social");
const mongoose = require("mongoose");
const validation = require("../validation/socialvalidation");
const error_handler = require("../utils/send.error.response");

const createSocial = async (req, res) => {
  try {
    const { error, value } = validation(res.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const newSocial = await Social.create(value);
  } catch (error) {
    error_handler(error, res);
  }
};

const getAllSocial = async (req, res) => {
  try {
    const socials = await Social.find();
    res.status(200).send({ data: socials });
  } catch (error) {
    error_handler(error, res);
  }
};

const getSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const social = await Social.findById(id);
    if (!social) {
      return res.status(404).send({ message: "Social not found" });
    }
    res.status(200).send({ data: social });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateSocialById = async (req, res) => {
  try {
    const data = req.body;

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const social = await Social.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(403).send({ message: "Invalid Id" });
    }
    const social = await Social.findByIdAndDelete(id);
    if (!social) {
      res.status(404).send({ message: "Social not found" });
    }
    res.status(200).send({ data: social });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  createSocial,
  getAllSocial,
  getSocialById,
  updateSocialById,
  deleteSocialById,
};
