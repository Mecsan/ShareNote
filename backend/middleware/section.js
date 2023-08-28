const sectionModel = require("../models/section");
const handle = require('express-async-handler');

//we are doing crude operation using :noteid | :sectionid only
// so it can be possible that a different user who have authenticated in his
// account, can possibly update notes/section which are not of his.

// to stop unauthorized section modify | delete we will be checking that in current request, whether the :sectionID is a part of current authenticated user or not

let sectionmiddlware = handle(async (req, res, next) => {
    let { sectionId } = req.params;
    let result = await sectionModel.findOne({ _id: sectionId });
    if (result.user == req.user) {
        next();
    } else {
        res.status(401);
        throw new Error("unauthorized access");
    }
})

module.exports = sectionmiddlware;