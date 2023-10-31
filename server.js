const express = require('express')
const mongoose = require('mongoose')
const logger = require('./middlewares/logger')

const usersRoute = require('./routes/users')
const experienceRouter = require('./routes/experiences')
const loginRoute = require('./routes/login')
const registerRoute = require('./routes/register')

const cors = require('cors')

const app = express();
require('dotenv').config()
const PORT = 5050;

app.use(cors())
app.use(express.json())
app.use(logger)

app.use('/', usersRoute)
app.use('/', experienceRouter)
app.use('/', loginRoute)
app.use('/', registerRoute)

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