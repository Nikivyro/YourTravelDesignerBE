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
    gallery: [
        {
            filename: {
                type: String,
                required: true
            },
            imageUrl: {
                type: String,
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'countrySchema'
        },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'citySchema'
        },
    },
    itineraryStops: [
        {
            day: {
                type: String,
                required: true
            },
            stops: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    description: {
                        type: String,
                        required: true
                    },
                    location:  [
                        {
                            latitude: {
                                type: String,
                                required: true
                            },
                            longitude: {
                                type: String,
                                required: true
                            }
                        }
                    ],
                }
            ]
        }
    ],
    tourDetails: {
        services: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'serviceSchema'
                },
                included: {
                    type: Boolean
                }
            }
        ],
        meetingPoint: [
            {
                latitude: {
                    type: String,
                    required: true
                },
                longitude: {
                    type: String,
                    required: true
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
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
    }
})

module.exports = mongoose.model('experienceModel', ExperienceSchema, 'experiences')