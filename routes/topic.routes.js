const {
  getAllTopics,
  createTopic,
  getTopicById,
  updateTopicById,
  deleteTopicById,
} = require("../controllers/topic.controller");

const router = require("express").Router();

router.get("/", getAllTopics);
router.post("/", createTopic);
router.get("/:id", getTopicById);
router.patch("/:id", updateTopicById);
router.delete("/:id", deleteTopicById);

module.exports = router;
