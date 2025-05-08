const {
  getAllAuthors,
  createAuthor,
  deleteAuthorById,
  updateAuthorById,
  getAuthorById,
} = require("../controllers/author.controller");

const router = require("express").Router();

router.get("/", getAllAuthors);
router.post("/", createAuthor);
router.get("/:id", getAuthorById);
router.patch("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;
