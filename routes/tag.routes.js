const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagById,
} = require("../controllers/tag.controller");

const router = require("express").Router();

router.get("/", getAllTags);
router.post("/", createTag);
router.get("/:id", getTagById);
router.patch("/:id", updateTag);
router.delete("/:id", deleteTag);

module.exports = router;