const express = require('express')
const coors = require('cors')

const { config } = require('./config/index')
const productsAPI = require('./routes/products')

const app = express()
let { ENV, PORT } = process.env

if (!ENV){
    console.log('Sin definición de ambiente --- Configurando por defecto')
    ENV = config.ENV
    PORT = config.PORT
}

app.use(coors())
app.use(express.json())
productsAPI(app)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}! =>"${ENV}"<=`))
