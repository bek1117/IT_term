const {
  getAllAuthors,
  createAuthor,
  deleteAuthorById,
  updateAuthorById,
  getAuthorById,
  loginAuthor,
} = require("../controllers/author.controller");
const authorJwtGuard = require("../middlewares/guards/author-jwt.guard");
const authorSelfGuard = require("../middlewares/guards/author-self.guard");

const router = require("express").Router();

router.get("/", authorJwtGuard, getAllAuthors);
router.post("/", createAuthor);
router.post("/login", loginAuthor);
router.get("/:id", authorJwtGuard, authorSelfGuard, getAuthorById);
router.patch("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;
