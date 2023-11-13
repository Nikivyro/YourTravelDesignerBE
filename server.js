const express = require('express')
const mongoose = require('mongoose')
const logger = require('./middlewares/logger')
const authenticateUser = require('./middlewares/authenticateUser')

const usersRoute = require('./routes/users')
const loginRoute = require('./routes/login')
const registerRoute = require('./routes/register')
const experienceRouter = require('./routes/experiences')
// const servicesRouter = require('./routes/services')
const locationsRouter = require('./routes/location')

const cors = require('cors')
const path = require('path')
const app = express();
require('dotenv').config()
const PORT = 5050;

app.use('/public', express.static(path.join(__dirname, 'public')))

// middlewares
app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/', usersRoute)
app.use('/', loginRoute)
app.use('/', registerRoute)
app.use('/', experienceRouter)
// app.use('/', servicesRouter)
app.use('/', locationsRouter)

app.use('/user/profile', authenticateUser);

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during db connection'))
db.once('open', () => {
    console.log('Database successfully connected!')
})

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))