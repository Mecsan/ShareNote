const sectionModel = require("../models/section");
 
//we are doing crude operation using :noteid | :sectionid only
// so it can be possible that a different user who have authenticated in his
// account, can possibly update notes/section which are not of his.

// to stop unauthorized section modify | delete we will be checking that in current request, whether the :sectionID is a part of current authenticated user or not

let sectionmiddlware = async (req, res, next) => {
    let { sectionId } = req.params;
    try {
        let result = await sectionModel.findOne({ _id: sectionId });
        if (result.user == req.user) {
            next();
        } else {
            throw new Error("unauthorized access");
        }
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

module.exports = sectionmiddlware;