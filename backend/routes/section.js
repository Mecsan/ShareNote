const router = require("express").Router();
const sectionvaliadte = require("../middleware/section")

const {
    getsection,
    addsection,
    updatesection,
    deletesection,
    getOnesection
} = require('../controllers/section');
const authenticate = require("../middleware/auth");

router.get("/", authenticate, getsection);

router.get("/:sectionId", getOnesection);

router.post("/", authenticate, addsection);

router.delete("/:sectionId", authenticate, sectionvaliadte, deletesection);

router.put("/:sectionId", authenticate, sectionvaliadte, updatesection);

module.exports = router;
