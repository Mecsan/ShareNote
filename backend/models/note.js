const mongo = require('mongoose');
let noteSchema = new mongo.Schema({
    section: {
        type: mongo.Schema.Types.ObjectId,
        required: true,
        ref: 'section'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



module.exports = new mongo.model('note', noteSchema);