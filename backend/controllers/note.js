const notemodel = require("../models/note");
const jwt = require('jsonwebtoken');

const getnote = async (req, res) => {
    try {
        let { noteId } = req.params;
        let data = await notemodel.findOne({ _id: noteId }).populate({
            path: "section",
            select: "user",
            populate: {
                path: "user",
                select: "name"
            }
        });
        let permission = false;
        let token = req.headers['authorization'];
        if (token) {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (data.section.user._id == decoded) permission = true;
        }
        res.json({ success: true, msg: { data, permission } });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const addnote = async (req, res) => {
    let { sectionId } = req.params;
    try {
        let newnote = new notemodel({ ...req.body, section: sectionId });
        let resu = await newnote.save();
        res.json({ success: true, msg: resu })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deletenote = async (req, res) => {
    let { noteId } = req.params;
    try {
        let deleted = await notemodel.deleteOne({ _id: noteId });
        res.json({ success: true, msg: noteId });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updatenote = async (req, res) => {
    let { noteId } = req.params;
    try {
        let updated = await notemodel.findOneAndUpdate({ _id: noteId }, req.body, { new: true });
        res.json({ success: true, msg: updated });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}



module.exports = {
    getnote,
    addnote,
    updatenote,
    deletenote,
}