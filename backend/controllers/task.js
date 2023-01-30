const Taskmodel = require("../models/task");

const getTask = async (req, res) => {
    try {
        let { dirId } = req.params;
        let data = await Taskmodel.find({ dir: dirId }).sort({ date: -1 });
        res.json({ success: true, msg: data });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const addTask = async (req, res) => {
    let { dirId } = req.params;
    try {
        let newTask = new Taskmodel({ ...req.body, dir: dirId });
        let resu = await newTask.save();
        res.json({ success: true, msg: resu })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deleteTask = async (req, res) => {
    let { taskId } = req.params;
    try {
        let deleted = await Taskmodel.deleteOne({ _id: taskId });
        res.json({ success: true, msg: taskId });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updateTask = async (req, res) => {
    let { taskId } = req.params;
    try {
        let updated = await Taskmodel.findOneAndUpdate({ _id: taskId }, req.body, { new: true });
        res.json({ success: true, msg: updated });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}



module.exports = {
    getTask,
    addTask,
    updateTask,
    deleteTask,
}