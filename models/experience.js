const mongoose = require('mongoose')

const ExperienceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Tour", "Itinerario", "Pacchetto"],
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tourDetails: {
        serviecs: [
            {
                type: String,
                required: true
            }
        ],
        meetingPoint: {
            type: String,
            required: true
        },
        people: {
            type: Number,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        languages: {
            type: String,
            enum: ["Italiano", "Inglese", "Spagnolo", "Francese"],
            required: true
        }
    },
    calendar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'calendarModel',
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
    }
})

module.exports = mongoose.model('experienceModel', ExperienceSchema, "experiences")