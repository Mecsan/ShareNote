const router = require("express").Router();
const sectionvaliadte = require("../middleware/section")

const {
    getsection,
    addsection,
    updatesection,
    deletesection,
    getOnesection
} = require('../controllers/section')

router.get("/", getsection);

router.get("/:sectionId", sectionvaliadte, getOnesection);

router.post("/", addsection);

router.delete("/:sectionId", sectionvaliadte, deletesection);

router.put("/:sectionId", sectionvaliadte, updatesection);

module.exports = router;
