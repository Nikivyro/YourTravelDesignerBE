const express = require('express')
const countryModel = require('../models/country')
const cityModel = require('../models/city')
const location = express.Router()
require('dotenv').config()
const crypto = require('crypto')
// const sizeOf = require('image-size')
const axios = require('axios');

const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Congif Cloaudinary
cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'travel-public',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => file.name
    }
})

//Config Multer
const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // posizione in cui salvare i file
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        // generiamo un suffisso unico per il nostro file
        const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`
        // qui ci recuperiamo da tutto solo l'estensione dello stesso file
        const fileExtension = file.originalname.split('.').pop()
        // eseguiamo la cb con il titolo completo
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

const upload = multer({ storage: internalStorage })
const cloudUpload = multer({ storage: cloudStorage })


location.get('/countries', async (req,res)=>{
    try {
        const countries = await countryModel.find()

        res.status(200).send({
            statusCode: 200,
            countries
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

location.post('/country/create', async (req, res)=>{
    
    const newCountry = new countryModel({
        name: req.body.name
    })

    try {
        const country = await newCountry.save()
        res.status(200).send({
            statusCode: 200,
            message: 'Paese salvato con successo',
            country
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

location.patch('/country/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedCountry = await countryModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).send({
            statusCode: 200,
            message: 'Paese aggiornato con successo',
            updatedCountry
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});

location.delete('/country/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await countryModel.findByIdAndDelete(id);

        res.status(200).send({
            statusCode: 200,
            message: 'Paese eliminato con successo'
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});

location.get('/cities', async (req,res)=>{
    try {
        const cities = await cityModel.find()
            .populate('country')

        res.status(200).send({
            statusCode: 200,
            cities
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

location.post('/city/create', async (req, res)=>{
    
    const newCity = new cityModel({
        name: req.body.name,
        country: req.body.country,
        cover: req.body.cover
    })

    try {
        const city = await newCity.save()
        console.log('City created successfully:', city);
        res.status(200).send({
            statusCode: 200,
            message: 'Città salvato con successo',
            city
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

location.patch('/city/update/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedCity = await cityModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).send({
            statusCode: 200,
            message: 'Città aggiornata con successo',
            updatedCity
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});

location.delete('/city/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await cityModel.findByIdAndDelete(id);

        res.status(200).send({
            statusCode: 200,
            message: 'Città eliminata con successo'
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});


location.post('/cities/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        // Effettua l'upload dell'immagine su Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        if (result && result.secure_url) {
            const imageURL = result.secure_url;

            // Ottieni le dimensioni dell'immagine tramite una richiesta HEAD
            const imageHeadResponse = await axios.head(imageURL);
            const contentLength = imageHeadResponse.headers['content-length'];

            res.status(200).json({ cover: imageURL, dimensions: { contentLength } });
        } else {
            res.status(500).send({
                statusCode: 500,
                message: "Errore nell'upload dell'immagine su Cloudinary"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});

location.get('/cities/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
  
    try {
      const city = await cityModel.findOne({ name: cityName }).populate('country');
  
      if (!city) {
        return res.status(404).json({ message: 'Città non trovata' });
      }
  
      res.json(city);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });


module.exports = location