const mongoose = require('mongoose')

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('countrySchema', CountrySchema, "countries")