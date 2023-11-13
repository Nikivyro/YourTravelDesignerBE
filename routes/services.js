const express = require('express')
const serviceModel = require('../models/service')
const service = express.Router()
const bcrypt = require('bcrypt')

service.get('/services', async (req,res)=>{
    try {
        const services = await serviceModel.find()

        res.status(200).send({
            statusCode: 200,
            services
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

service.post('/service/create', async (req, res)=>{
    
    const newService = new serviceModel({
        name: req.body.name,
        icon: req.body.icon
    })

    try {
        const service = await newService.save()
        res.status(200).send({
            statusCode: 200,
            message: 'Utente salvato con successo',
            service
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

module.exports = service