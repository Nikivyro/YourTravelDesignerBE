const express = require('express')
const experienceModel = require('../models/experience')
const userModel = require('../models/user')
const cityModel = require('../models/city')
const experience = express.Router()
require('dotenv').config()
const crypto = require('crypto')
// const sizeOf = require('image-size')
const axios = require('axios');

const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { log } = require('console')

// Congif Cloaudinary
cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'experiences-public',
        format: async (req, file) => 'jpg',
        public_id: (req, file) => file.originalname, // Modifica questo se vuoi usare un nome diverso
        multiple: true, // Aggiungi questa opzione per gestire più file
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

// const upload = multer({ storage: internalStorage.array('gallery', 5) });
const cloudUpload = multer({ storage: cloudStorage });

// GET ALL
experience.get('/experiences', async (req, res) => {
    try {
        const cityName = req.query.city;
        let query = {};

        if (cityName) {
            const city = await cityModel.findOne({ name: cityName });

            if (city) {
                const cityId = city._id;

                query = { 'location.city': cityId };

                const experiences = await experienceModel.find(query)
                    .populate('supplier')
                    .populate({
                        path: 'location',
                        populate: {
                            path: 'city',
                            model: 'citySchema'
                        }
                    });

                res.status(200).send({
                    statusCode: 200,
                    cityId,
                    experiences
                });
            } else {
                return res.status(404).send({
                    statusCode: 404,
                    message: "Città non trovata"
                });
            }
        } else {
            const experiences = await experienceModel.find()
                .populate('supplier')
                .populate({
                    path: 'location',
                    populate: {
                        path: 'city',
                        model: 'citySchema'
                    }
                });

            res.status(200).send({
                statusCode: 200,
                experiences
            });
        }
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});



// GET ONLY BY ID
experience.get('/experiences/:experienceId', async (req, res)=> {
    const { experienceId } = req.params
    const experienceExist = await experienceModel.findById(experienceId)

    if (!experienceExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This experience does not exist!"
        })
    }
    try {
        const experience = await experienceModel.findById(experienceId)
            .populate('supplier')
            .populate({
                path: 'location',
                populate: {
                    path: 'city',
                    model: 'citySchema'
                }
            });

        res.status(200).send({
            statusCode: 200,
            message: "Experience finded successfully",
            experience
        })

    } catch (error) {
        console.error('Errore nella rotta /experiences:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// POST
experience.post('/experiences/create', async (req, res) => {
    try {
        const experienceData = req.body; // Dettagli dell'esperienza
        // Salva l'esperienza nel database
        const newExperience = new experienceModel(experienceData);
        await newExperience.save();

        res.status(201).json(newExperience);
    } catch (err) {
        console.error("Errore durante la creazione dell'esperienza:", err);
        res.status(500).json({ error: 'Errore durante la creazione dell\'esperienza' });
    }
});

// PATCH
experience.patch('/experiences/edit/:experienceId', cloudUpload.single('cover'), async (req, res) => {
    try {
        const experienceId = req.params.experienceId;

        // Verifica se req.file è definito
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            if (!result || !result.secure_url) {
                return res.status(500).json({
                    statusCode: 500,
                    message: "Errore nell'upload dell'immagine su Cloudinary"
                });
            }
            req.body.cover = result.secure_url;
        }

        // Verifica se l'esperienza esiste
        const existingExperience = await experienceModel.findById(experienceId);
        if (!existingExperience) {
            return res.status(404).json({
                statusCode: 404,
                message: "Experience non trovata."
            });
        }

        // Validazione dei dati
        const dataToUpdate = req.body;
        if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "I dati da aggiornare non sono validi."
            });
        }

        // Aggiorna l'esperienza
        const options = { new: true };
        const updatedExperience = await experienceModel.findByIdAndUpdate(experienceId, dataToUpdate, options);

        res.status(200).json(updatedExperience);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});


// DELETE
experience.delete('/experiences/delete/:experienceId', async (req, res) => {
    const { experienceId } = req.params
       
    try {
        const experience = await experienceModel.findByIdAndDelete(experienceId)
        if (!experience) {
            return res.status(404).send({
                statusCode: 404,
                message: "Experience non trovata o già eliminata"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Experience eliminata con successo",
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

experience.post('/experiences/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        if (result && result.secure_url) {
            const imageURL = result.secure_url;
            res.status(200).json({ cover: imageURL });
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

// GET BY TITLE
experience.get('/experiences/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const experiences = await experienceModel.find({ name: { $regex: title, $options: 'i' } })
            .populate('supplier')
            .populate({
                path: 'location',
                populate: {
                    path: 'city',
                    model: 'citySchema'
                }
            });

        res.status(200).send({
            statusCode: 200,
            experiences
        });
    } catch (error) {
        console.error('Errore nella ricerca per titolo:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});

// GET BY TYPE
experience.get('/experiences/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const experiences = await experienceModel.find({ type })
            .populate('supplier')
            .populate({
                path: 'location',
                populate: {
                    path: 'city',
                    model: 'citySchema'
                }
            });

        res.status(200).send({
            statusCode: 200,
            experiences
        });
    } catch (error) {
        console.error('Errore nella ricerca per tipo:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});

// GET BY CATEGORY
experience.get('/experiences/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const experiences = await experienceModel.find({ category })
            .populate('supplier')
            .populate({
                path: 'location',
                populate: {
                    path: 'city',
                    model: 'citySchema'
                }
            });

        res.status(200).send({
            statusCode: 200,
            experiences
        });
    } catch (error) {
        console.error('Errore nella ricerca per categoria:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});



experience.get('/experiences/city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName;
        let query = {};

        const city = await cityModel.findOne({ name: cityName });

        if (city) {
            const cityId = city._id;

            query = { 'location.city': cityId };

            const experiences = await experienceModel.find(query)
                .populate('supplier')
                .populate({
                    path: 'location',
                    populate: {
                        path: 'city',
                        model: 'citySchema'
                    }
                });

            res.status(200).send({
                statusCode: 200,
                cityId,
                experiences
            });
        } else {
            return res.status(404).send({
                statusCode: 404,
                message: "Città non trovata"
            });
        }
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

experience.get('/experiences/city/:cityName/related/:experienceId', async (req, res) => {
    try {
        const { cityName, experienceId } = req.params
        const query = { 'location.city.name': cityName, _id: { $ne: experienceId } };

        const experiences = await experienceModel.find(query)
            .populate('supplier')
            .populate({
                path: 'location',
                populate: {
                    path: 'city',
                    model: 'citySchema'
                }
            });
        console.log(experiences);
        // Invia le esperienze associate a quella città come risposta
        res.status(200).json({ experiences });
    } catch (error) {
        console.error('Errore nella ricerca per città:', error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});


module.exports = experience