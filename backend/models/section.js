const mongo = require('mongoose');
let sectionSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        default: "add description"
    }
}, {
    timestamps: true
})

module.exports = new mongo.model('section', sectionSchema);