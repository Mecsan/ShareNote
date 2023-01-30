const mongo = require('mongoose');
const { notischema } = require("./subSchemas/noti");
let userSchema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isTitle: {
        type: Boolean,
        default: true
    },
    isDate: {
        type: Boolean,
        default: true
    },
    notifications: [notischema]
})

module.exports = new mongo.model('user', userSchema);