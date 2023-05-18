const sectionmodel = require("../models/section");
const noteModel = require("../models/note");
const jwt = require('jsonwebtoken');

const getsection = async (req, res) => {
    try {
        let data = await sectionmodel.find({ user: req.user }).sort({ date: -1 });
        res.json({ success: true, msg: data });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const getOnesection = async (req, res) => {
    let { sectionId } = req.params;

    try {
        let data = await sectionmodel.findOne({ _id: sectionId }).populate({ path: 'user', select: "name" });
        if (!data) {
            throw new Error("no such section with id: " + sectionId + " exist in your account");
        }
        let permission = false;
        let token = req.headers['authorization'];
        if (token) {
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (data.user._id == decoded) permission = true;
        }
        let notes = await noteModel.find({ section: sectionId }).sort({ createdAt: -1 });
        res.json({ success: true, msg: { section: data, notes, permission } });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

const addsection = async (req, res) => {
    let newsection = new sectionmodel({ ...req.body, user: req.user });
    try {
        let resu = await newsection.save();
        res.json({ success: true, msg: resu })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deletesection = async (req, res) => {
    let { sectionId } = req.params;
    try {
        let deleted = await sectionmodel.deleteOne({ _id: sectionId });
        let some = await noteModel.deleteMany({ section: sectionId });
        res.json({ success: true, msg: sectionId });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const updatesection = async (req, res) => {
    let { sectionId } = req.params;
    try {

        let updated = await sectionmodel.findOneAndUpdate({ _id: sectionId }, req.body, {
            new: true
        });
        res.json({ success: true, msg: updated });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}


const copySection = async (req, res) => {
    try {
        let { sectionId } = req.params;
        let section = await sectionmodel.findOne({ _id: sectionId });
        let newSection = await new sectionmodel({
            title: section.title,
            desc: section.desc,
            user: req.user
        });
        let result = await newSection.save();

        const notes = await noteModel.find({ section: sectionId });
        let newNotes = notes.map((note) => {
            let obj = note.toObject();
            return {
                title: obj.title,
                desc: obj.desc,
                section: newSection._id
            }
        })

        const data = await noteModel.insertMany(newNotes);
        res.json({ success: true, msg: result })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}
module.exports = {
    getsection,
    getOnesection,
    addsection,
    updatesection,
    deletesection,
    copySection
}