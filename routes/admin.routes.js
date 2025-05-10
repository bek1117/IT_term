const { createAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");

const router = require("express").Router();

router.get("/", getAdmins);
router.post("/", createAdmin);
router.get("/:id", getAdminById);
router.get("/:id", updateAdmin);
router.get("/:id", deleteAdmin);

module.exports = router;