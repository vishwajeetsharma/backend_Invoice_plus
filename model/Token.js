const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    refresh_token : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Token', tokenSchema)