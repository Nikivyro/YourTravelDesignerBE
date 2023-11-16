const express = require('express')
const userModel = require('../models/user')
const user = express.Router()
const bcrypt = require('bcrypt')
const authenticateUser = require('../middlewares/authenticateUser');

user.get('/users', async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).send({
        statusCode: 200,
        users,
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  });
  
user.get('/user/profile', authenticateUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: 'Utente non trovato',
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        user,
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
});

user.post('/user/create', async (req, res)=>{
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    })

    try {
        const user = await newUser.save()
        res.status(200).send({
            statusCode: 200,
            message: 'Utente salvato con successo',
            user
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

// PATCH USER ID
user.patch('/user/profile/update', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userExist = await userModel.findById(userId);

    if (userExist) {
      const userNewData = req.body;
      const options = { new: true };
      const result = await userModel.findByIdAndUpdate(userId, userNewData, options);

      res.status(200).send({
        statusCode: 200,
        message: 'Dati dell\'utente aggiornati con successo',
        result,
      });
    } else {
      return res.status(404).send({
        statusCode: 404,
        message: 'Questo utente non esiste!',
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno del server',
    });
  }
});

module.exports = user