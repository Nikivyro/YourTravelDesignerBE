const mongoose = require('mongoose')

const CalendarSchema = new mongoose.Schema({
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'experienceModel',
    },
    availableDates: [Date],
});

module.exports = mongoose.model('calendarSchema', CalendarSchema, "calendars")