const notemodel = require("../models/note");
const sectionmiddlware = require("./section");

//we are doing crude operation using :noteid | :sectionid only
// so it can be possible that a different user who have authenticated in his
// account, can possibly update notes | section which are not of his.

// to stop unauthorized note modify/delete we will be checking that in current request, whether the :noteId is belong to  current authenticated person or not

let noteMiddleware = async (req, res, next) => {
    let { noteId } = req.params;
    try {
        let result = await notemodel.findOne({ _id: noteId });
        let sectionId = result.section;
        req.params.sectionId = sectionId;
        sectionmiddlware(req, res, next);
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

module.exports = noteMiddleware;