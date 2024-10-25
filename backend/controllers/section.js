const sectionmodel = require("../models/section");
const noteModel = require("../models/note");
const jwt = require('jsonwebtoken');
const handle = require('express-async-handler');

const getsection = handle(async (req, res) => {
    let data = await sectionmodel.find({ user: req.user }).sort({ date: -1 });
    // await new Promise((res,rej)=>{
    //     setTimeout(res,500)
    // })
    res.json({ success: true, msg: data });
})

const getOnesection = handle(async (req, res) => {
    let { sectionId } = req.params;
    let data = await sectionmodel.findOne({ _id: sectionId }).populate({ path: 'user', select: "name" });
    if(!data) {
        res.status(404);
        throw new Error("Section not found");
    }
    let permission = false;
    let token = req.headers['authorization'];
    if (token) {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (data.user._id == decoded) permission = true;
    }

    let { search } = req.query;

    var query = {
        section: sectionId,
        $or: [
            {
                title: { $regex: search, $options: 'i' }
            },
            {
                desc: { $regex: search, $options: 'i' }
            }]
    }

    if (!search) {
        delete query['$or'];
    }

    let notes = await noteModel.find(query, {
        section: 0
    }).sort({ updatedAt: -1 });

    res.json({ success: true, msg: { section: data, notes, permission } });
});

const addsection = handle(async (req, res) => {
    let newsection = new sectionmodel({ ...req.body, user: req.user });
    let resu = await newsection.save();
    res.status(201).json({ success: true, msg: resu })
})

const deletesection = handle(async (req, res) => {
    let { sectionId } = req.params;
    let deleted = await sectionmodel.deleteOne({ _id: sectionId });
    let some = await noteModel.deleteMany({ section: sectionId });
    res.json({ success: true, msg: sectionId });
})

const updatesection = handle(async (req, res) => {
    let { sectionId } = req.params;
    let updated = await sectionmodel.findOneAndUpdate({ _id: sectionId }, req.body, {
        new: true
    });
    res.json({ success: true, msg: updated });
})


const copySection = handle(async (req, res) => {
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
    res.status(201).json({ msg: result })
})
module.exports = {
    getsection,
    getOnesection,
    addsection,
    updatesection,
    deletesection,
    copySection
}