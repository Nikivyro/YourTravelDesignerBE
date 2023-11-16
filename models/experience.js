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
    category: {
        type: String,
        enum: ["Cultura", "Gastronomia", "Natura", "Sport"],
        required: true
    },
    cover: {
        type: String,
        default: 'img/placeholder.jpg'
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'citySchema'
        },
    },
    itineraryStops: [
        {
          day: {
            type: String,
          },
          stops: [
            {
              name: {
                type: String,
              },
              description: {
                type: String,
              },
              location: {
                latitude: {
                  type: String,
                },
                longitude: {
                  type: String,
                }
              },
            }
          ]
        }
    ],
    tourDetails: {
        services: [
            {
                service: {
                    type: String,
                },
                included: {
                    type: Boolean
                }
            }
        ],
        meetingPoint: [
            {
                address: {
                    type: String,
                },
                latitude: {
                    type: String,
                },
                longitude: {
                    type: String,
                }
            }
        ],
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
        required: false
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
    }
})

module.exports = mongoose.model('experienceModel', ExperienceSchema, 'experiences')