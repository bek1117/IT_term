const Author = require("../schemas/author");
const mongoose = require("mongoose");
const error_handler = require("../utils/send.error.response");
const { authorValidation } = require("../validation/author.validation");
const bcrypt = require('bcrypt');

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).send({ data: authors });
  } catch (error) {
    error_handler(error, res);
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res.status(200).send({ data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

const createAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return error_handler(error, res);
    }
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    const newAuthor = new Author.create({ ...value, password: hashedPassword });
    res
      .status(201)
      .send({ message: "Author created successfully", data: newAuthor });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findByIdAndUpdate(id, data);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res
      .status(200)
      .send({ message: "Author updated successfully", data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).send({ message: "Author not found" });
    }
    res
      .status(200)
      .send({ message: "Author deleted successfully", data: author });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
};
