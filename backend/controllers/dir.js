const Dirmodel = require("../models/dir");
const taskModel = require("../models/task");

const getDir = async (req, res, next) => {
    try {
        let data = await Dirmodel.find({ user: req.user }).sort({ date: -1 });
        res.json({ success: true, msg: data });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

const getOneDir = async (req, res) => {
    let { dirId } = req.params;

    try {
        let data = await Dirmodel.findOne({ _id: dirId });
        if (!data) {
            throw new Error("no such dir with id: " + dirId + " exist in your account");
        }
        let tasks = await taskModel.find({ dir: dirId }).sort({ date: -1 });
        res.json({ success: true, msg: { dir: data, tasks } });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

const addDir = async (req, res) => {
    let newDir = new Dirmodel({ user: req.user, ...req.body });
    try {
        let resu = await newDir.save();
        res.json({ success: true, msg: resu })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deleteDir = async (req, res) => {
    let { dirId } = req.params;
    try {
        let deleted = await Dirmodel.deleteOne({ _id: dirId });
        let some = await taskModel.deleteMany({ dir: dirId });
        res.json({ success: true, msg: dirId });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updateDir = async (req, res) => {
    let { dirId } = req.params;
    try {

        let updated = await Dirmodel.findOneAndUpdate({ _id: dirId }, req.body, {
            new: true
        });
        res.json({ success: true, msg: updated });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

module.exports = {
    getDir,
    getOneDir,
    addDir,
    updateDir,
    deleteDir
}