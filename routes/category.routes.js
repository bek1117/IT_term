const {
  getAllCategory,
  addCategory,
  getCategoryById,
  deleteCategoryById,
} = require("../controllers/category.controller");

const router = require("express").Router();

router.get("/", getAllCategory);
router.post("/", addCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", getCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
