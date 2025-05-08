const router = require("express").Router();
const {
  getAllSynonyms,
  getSynonymById,
  createSynonym,
  updateSynonymById,
  deleteSynonymById,
} = require("../controllers/synonym.controller");

router.get("/", getAllSynonyms);
router.get("/:id", getSynonymById);
router.post("/", createSynonym);
router.put("/:id", updateSynonymById);
router.delete("/:id", deleteSynonymById);

module.exports = router;