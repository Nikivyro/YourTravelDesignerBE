const express = require('express');
const register = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

const registrationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  businessName: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.number().required().min(100000000), 
});

register.post('/user/register', async (req, res) => {
  try {
    // Validazione dei dati in ingresso
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        message: error.details[0].message,
      });
    }

    // Verifica se l'email è già registrata
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        message: 'L\'email è già registrata. Prova con un\'altra email.',
      });
    }

    // Hash della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Creazione di un nuovo utente
    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      businessName: req.body.businessName,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      password: hashedPassword,
    });

    // Salvataggio dell'utente nel database
    const savedUser = await newUser.save();

    res.status(201).json({
      statusCode: 201,
      message: 'Registrazione avvenuta con successo. Ora puoi effettuare il login.',
    });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Errore durante la registrazione.',
    });
  }
});

module.exports = register;
