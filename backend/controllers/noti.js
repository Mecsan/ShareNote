const taskModel = require("../models/task");
const userModel = require("../models/user");
const { notimodel } = require("../models/subSchemas/noti")

const UpdateDb = async () => {

    let passedTask = await taskModel.find({
        reminder: { $ne: null },
        reminder: { $lt: new Date() }
    }).populate({
        path: "dir",
        select: "title user",
        populate: {
            path: "user",
            select: "name mail"
        }
    })

    for (task of passedTask) {
        let newNoti = new notimodel({
            title: task.title,
            desc: task.desc,
            folder: task.dir.title,
            date: task.reminder,
            hasNoticed: false
        });

        let user = task.dir.user._id,
            mail = task.dir.user.mail;

        // send mail to mail

        await userModel.findOneAndUpdate({ _id: user }, {
            $push: {
                notifications: newNoti
            }
        })
    }

    await taskModel.updateMany({
        _id: {
            $in: passedTask.map(task => task._id)
        }
    }, {
        reminder: null
    });
}

const getNotis = async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user });
        let msg = user.notifications.sort((a, b) => {
            if (new Date(a.date).getTime() < new Date(b.date).getTime()) {
                return 1;
            }
            return -1;
        })
        res.json({ success: true, msg });

    } catch (e) {
        res.json({ success: false, msg: e })
    }

}

const seenNotis = async (req, res) => {
    let { notiId } = req.params;
    try {
        let newtak = await userModel.findOneAndUpdate(
            {
                _id: req.user,
                "notifications._id": notiId
            }, {
            $set: {
                "notifications.$.hasNoticed": true
            }
        });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

const deleteNoti = async (req, res) => {
    try {
        let { id } = req.params;

        await userModel.findOneAndUpdate({ _id: req.user }, {
            $pull: { notifications: { _id: id } }
        });

        res.json({ success: true, id: id });

    } catch (e) {
        res.json({ success: false, msg: e.message });
    }
}



module.exports = {
    getNotis,
    seenNotis,
    UpdateDb,
    deleteNoti
}