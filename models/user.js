const mongoose = require('mongoose')

const  UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.iconscout.com/icon/free/png-512/free-avatar-370-456322.png"
    },
    phone: {
        type: Number,
        required: true,
        minlength: 9
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ["admin", "Agenzia", "Tour Operator"],
        required: true
    }
}, { timestamps: true, strict: true });

module.exports = mongoose.model('userModel', UserSchema, 'users')