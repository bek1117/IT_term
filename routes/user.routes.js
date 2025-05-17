const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

module.exports = router;
