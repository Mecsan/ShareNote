const router = require("express").Router();
const {
    getnote,
    addnote,
    updatenote,
    deletenote,

} = require('../controllers/note')

const authenticate = require("../middleware/auth");

const sectionmiddleware = require("../middleware/section");

const notemiddle = require("../middleware/note")

router.get("/:noteId", getnote);

router.post("/:sectionId", authenticate, sectionmiddleware, addnote);

router.delete("/:noteId", authenticate, notemiddle, deletenote);

router.put("/:noteId", authenticate, notemiddle, updatenote);

module.exports = router;
