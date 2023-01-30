const taskmodel = require("../models/task");

//we are doing crude operation using :taskid | :dirid only
// so it can be possible that a different user who have authenticated in his
// account, can possibly update tasks | dir which are not of his.

// to stop unauthorized task modify/delete we will be checking that in current request, whether the :taskId is belong to dirId or not, & dirId belong to current authenticated person or not ( which is done in dirmiddleware )

let taskMiddleware = async (req, res, next) => {
    let { taskId, dirId } = req.params;
    try {
        let result = await taskmodel.findOne({ _id: taskId });
        if (result.dir == dirId) {
            next();
        } else {
            throw new Error("unauthorized access");
        }
    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}

module.exports = taskMiddleware;