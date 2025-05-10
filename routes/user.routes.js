const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/user.controller");

const router = require("express").Router();
const isExpert = require("../middlewares/guards/user-expert.guard");
const selfGuard = require("../middlewares/guards/user-self.guard");
const JWTCheker = require("../middlewares/guards/user-jwt.guard");

router.get("/", JWTCheker, isExpert, getUsers);
router.post("/", JWTCheker, isExpert, createUser);
router.get("/:id", JWTCheker, selfGuard, getUserById);
router.patch("/:id", JWTCheker, selfGuard, updateUser);
router.delete("/:id", JWTCheker, selfGuard, deleteUser);
router.post("/login", loginUser);

module.exports = router;
