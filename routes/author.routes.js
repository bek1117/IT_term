const {
  getAllAuthors,
  createAuthor,
  deleteAuthorById,
  updateAuthorById,
  getAuthorById,
  loginAuthor,
  AuthorLogout,
  AuthorRefreshToken,
  ActivateUser,
} = require("../controllers/author.controller");

const router = require("express").Router();

router.get("/", getAllAuthors);
router.post("/", createAuthor);
router.post("/login", loginAuthor);
router.get("/logout", AuthorLogout);
router.get("/refresh", AuthorRefreshToken);
router.get("/activate/:id", ActivateUser);
router.get("/:id", getAuthorById);
router.patch("/:id", updateAuthorById);
router.delete("/:id", deleteAuthorById);

module.exports = router;
