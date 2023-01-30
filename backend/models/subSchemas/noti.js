const mongo = require('mongoose');
let notischema = new mongo.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    folder: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    hasNoticed: {
        type: Boolean,
        default: false
    }
})

const notimodel = new mongo.model('noti', notischema);

module.exports = { notischema, notimodel };