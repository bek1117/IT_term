const Category = require("../schemas/category");
const error_handler = require("../utils/send.error.response");
const validate = require("../validation/category.validation");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({ data: categories });
  } catch (error) {
    error_handler(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ data: category });
  } catch (error) {
    error_handler(error, res);
  }
};

const createCategory = async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const newCategory = await Category.create(value);
    res.status(201).send({ data: newCategory });
  } catch (error) {
    error_handler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = validate(req.body);
    if (error) {
      return res.status(400).send({
        errors: error.details.map((d) => d.message),
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ data: updatedCategory });
  } catch (error) {
    error_handler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.status(200).send({ data: deletedCategory });
  } catch (error) {
    error_handler(error, res);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
