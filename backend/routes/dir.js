const router = require("express").Router();
const Dirvaliadte = require("../middleware/Dirmiddleware")

const {
    getDir,
    addDir,
    updateDir,
    deleteDir,
    getOneDir
} = require('../controllers/dir')

router.get("/", getDir);

router.get("/:dirId", Dirvaliadte, getOneDir);

router.post("/", addDir);

router.delete("/:dirId", Dirvaliadte, deleteDir);

router.put("/:dirId", Dirvaliadte, updateDir);

module.exports = router;
