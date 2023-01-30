const mongo = require('mongoose');
let taskSchema = new mongo.Schema({
    dir: {
        type: mongo.Schema.Types.ObjectId,
        required: true,
        ref: 'dir'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    reminder: {
        type: Date,
        default: null
    },
})



module.exports = new mongo.model('task', taskSchema);