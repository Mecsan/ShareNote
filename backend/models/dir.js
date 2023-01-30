const mongo = require('mongoose');
let dirSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    desc: {
        type: String,
        default: "this is some desc"
    } 
})

module.exports = new mongo.model('dir', dirSchema);