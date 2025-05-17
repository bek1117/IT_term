const router = require("express").Router();
const {
  addDict,
  getAllDict,
  getDictByLetter,
  getDictById,
  updateDictById,
  deleteDictById,
} = require("../controllers/dict.controller");

router.post("/",addDict);
router.get("/", getAllDict);
router.get("/letter/:letter", getDictByLetter);
router.get("/:id", getDictById);
router.put("/:id", updateDictById);
router.delete("/:id", deleteDictById);

module.exports = router;
