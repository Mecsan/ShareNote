const userModel = require('../models/user');
const sectionModel = require("../models/section")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const handle = require('express-async-handler');

const Login = handle(async (req, res) => {
    let { mail, password } = req.body;

    let result = await userModel.findOne({ mail: mail });
    if (!result) {
        res.status(404);
        throw new Error("Email not found");
    }

    let pass = await bcrypt.compare(password, result.password);
    if (!pass) {
        res.status(401);
        throw new Error("Incorrect password");
    }

    const encode = jwt.sign(result._id.valueOf(), process.env.JWT_SECRET);

    res.json({ msg: encode });
})

const Register = handle(async (req, res) => {
    let { name, mail, password } = req.body;
    let result = await userModel.findOne({ mail: mail });
    if (result) {
        res.status(409);
        throw new Error("Email already registerd");
    }

    let salt = await bcrypt.genSalt();
    let hash = await bcrypt.hash(password, salt);

    let newUser = new userModel({
        name, mail, password: hash
    });

    // creating a default section for storing notes
    let defaultsection = new sectionModel({
        title: "home",
        desc: "Add your notes here",
        user: newUser._id,
    })

    await defaultsection.save();

    let resu = await newUser.save();
    const encode = jwt.sign(resu._id.valueOf(), process.env.JWT_SECRET);

    res.json({ msg: encode });
})

let Info = handle(async (req, res) => {
    let user = await userModel.findOne({ _id: req.user }).select("-password");
    if (!user) {
        res.status(404);
        throw new Error("no user found");
    }
    res.json({ msg: user })
})


module.exports = { Login, Register, Info }