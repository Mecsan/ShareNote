const router = require("express").Router();
const {
    getnote,
    addnote,
    updatenote,
    deletenote,

} = require('../controllers/note')

const sectionmiddleware = require("../middleware/section");

const notemiddle = require("../middleware/note")

router.get("/:noteId", notemiddle, getnote);

router.post("/:sectionId", sectionmiddleware, addnote);

router.delete("/:noteId", notemiddle, deletenote);

router.put("/:noteId", notemiddle, updatenote);

module.exports = router;
