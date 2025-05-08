const {
  getCategoryById,
  deleteCategoryById,
  getAllCategories,
  createCategory,
} = require("../controllers/category.controller");

const router = require("express").Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", getCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
