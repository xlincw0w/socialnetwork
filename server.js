const express = require('express')
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 3001

require('dotenv').config()
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/profile', require('./api/Profile/profile'))
app.use('/api/inscription', require('./api/Inscription/inscription'))

app.get('/api/connected', (req, res) => {
    res.json({ connected_to_api: true })
})

app.listen(PORT, function () {
    console.log(`Server listenning on port ${PORT}!\n`)
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './dist', 'index.html'))
})
