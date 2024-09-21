const notemodel = require("../models/note");
const jwt = require('jsonwebtoken');
const handle = require('express-async-handler');

const getnote = handle(async (req, res) => {
    let { noteId } = req.params;
    let data = await notemodel.findOne({ _id: noteId }).populate({
        path: "section",
        select: "user",
        populate: {
            path: "user",
            select: "name"
        }
    });
    if(!data){
        res.status(404);
        throw new Error("Note not found");
    }
    let permission = false;
    let token = req.headers['authorization'];
    if (token) {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (data.section.user._id == decoded) permission = true;
    }
    res.json({ msg: { data, permission } });
})

const addnote = handle(async (req, res) => {
    let { sectionId } = req.params;
    let newnote = new notemodel({ ...req.body, section: sectionId });
    let resu = await newnote.save();
    res.status(201).json({ msg: resu })
})

const deletenote = handle(async (req, res) => {
    let { noteId } = req.params;
    let deleted = await notemodel.deleteOne({ _id: noteId });
    res.json({ msg: noteId });
})

const updatenote = handle(async (req, res) => {
    let { noteId } = req.params;
    let updated = await notemodel.findOneAndUpdate({ _id: noteId }, req.body, { new: true });
    res.json({ msg: updated });
})

module.exports = {
    getnote,
    addnote,
    updatenote,
    deletenote,
}