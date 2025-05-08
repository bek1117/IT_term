const { get } = require("http");
const {
  getAllDescription,
  createDescription,
  updateDescriptionById,
  deleteDescription,
  getDescriptionById,
} = require("../controllers/description.controller");
const router = require("express").Router();

router.get("/", getAllDescription);
router.post("/", createDescription);
router.get("/:id", getDescriptionById);
router.patch("/:id", updateDescriptionById);
router.delete("/:id", deleteDescription);

module.exports = router;
