const userModel = require('../models/user');
const dirModel = require("../models/dir")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
    let { mail, password } = req.body;
    try {
        let result = await userModel.findOne({ mail: mail });
        if (!result) {
            throw new Error("Email not found");
        }

        let pass = await bcrypt.compare(password, result.password);
        if (!pass) {
            throw new Error("Incorrect password");
        }

        const encode = jwt.sign(result._id.valueOf(), process.env.JWT_SECRET);

        res.json({ success: true, msg: encode });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

const Register = async (req, res) => {
    let { name, mail, password } = req.body;
    try {

        let result = await userModel.findOne({ mail: mail });
        if (result) throw new Error("Email already registerd");

        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(password, salt);

        let newUser = new userModel({
            name, mail, password: hash
        });

        // creating a default directory for storing tasks
        let defaultDir = new dirModel({
            title: "home",
            desc: "Add your tasks here",
            user: newUser._id,
        })

        await defaultDir.save();

        let resu = await newUser.save();
        const encode = jwt.sign(resu._id.valueOf(), process.env.JWT_SECRET);

        res.json({ success: true, msg: encode });

    } catch (e) {
        res.json({ success: false, msg: e.message })
    }

}

let Info = async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user });
        if (!user) throw new Error("no user found");
        res.json({ success: true, msg: user })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

let userSetting = async (req, res) => {
    try {
        let user = await userModel.findOneAndUpdate({ _id: req.user }, req.body, {
            new: true
        });
        res.json({ success: true, msg: user })
    } catch (e) {
        res.json({ success: false, msg: e.message })
    }
}

module.exports = { Login, Register, Info, userSetting }