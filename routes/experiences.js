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

experience.post('/experiences/create', async (req, res) => {
    try {
        // Estrai i dati dalla richiesta HTTP
        const experienceData = req.body;

        // Crea una nuova Experience con i dati forniti
        const newExperience = new experienceModel(experienceData);

        // Salva la nuova Experience nel database
        await newExperience.save();

        res.status(201).json(newExperience);
    } catch (err) {
        console.error("Errore durante la creazione dell'esperienza:", err);
        res.status(500).json({ error: 'Errore durante la creazione dell\'esperienza' });
    }
});


module.exports = experience