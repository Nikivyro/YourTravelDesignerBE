const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    }
})

module.exports = mongoose.model('serviceSchema', ServiceSchema, "services")