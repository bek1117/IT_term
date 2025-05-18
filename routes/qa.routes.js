const {
  getAllQAs,
  getQAById,
  createQA,
  updateQAById,
  deleteQAById,
} = require("../controllers/question-answer.controller");

const router = require("express").Router();

router.get("/", getAllQAs);
router.get("/:id", getQAById);
router.post("/", createQA);
router.put("/:id", updateQAById);
router.delete("/:id", deleteQAById);

module.exports = router;