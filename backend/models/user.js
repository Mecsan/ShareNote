const mongo = require('mongoose');
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
    }
})

module.exports = new mongo.model('user', userSchema);