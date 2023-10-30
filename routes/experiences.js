const express = require('express')
const experienceModel = require('../models/experience')
const userModel = require('../models/user')
const experience = express.Router()

experience.get('/experiences', async (req, res)=>{
    try {
        const experiences = await experienceModel.find()

        res.status(200).send({
            statusCode: 200,
            experiences
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

module.exports = experience