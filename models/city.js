const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'countrySchema'
    }
})

module.exports = mongoose.model('citySchema', CitySchema, "cities")