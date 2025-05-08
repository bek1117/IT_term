const { get } = require("http");
const {
  createDescription,
  updateDescriptionById,
  getDescriptionById,
  getAllDescriptions,
  deleteDescriptionById,
} = require("../controllers/description.controller");
const router = require("express").Router();

router.get("/", getAllDescriptions);
router.post("/", createDescription);
router.get("/:id", getDescriptionById);
router.patch("/:id", updateDescriptionById);
router.delete("/:id", deleteDescriptionById);

module.exports = router;
