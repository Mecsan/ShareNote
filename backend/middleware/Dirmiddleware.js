const dirModel = require("../models/dir");
 
//we are doing crude operation using :taskid | :dirid only
// so it can be possible that a different user who have authenticated in his
// account, can possibly update tasks/dir which are not of his.

// to stop unauthorized dir modify | delete we will be checking that in current request, whether the :dirId is a part of current authenticated user or not

let checkDirinAuth = async (req, res, next) => {
    let { dirId } = req.params;
    try {
        let result = await dirModel.findOne({ _id: dirId });
        if (result.user == req.user) {
            next();
        } else {
            throw new Error("unauthorized access");
        }
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

module.exports = checkDirinAuth;