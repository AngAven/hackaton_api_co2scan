const express = require('express')

const { config } = require('./config/index')
const productsAPI = require('./routes/products')

const app = express()
let { ENV, PORT } = process.env

if (!ENV){
    console.log('Sin definición de ambiente --- Configurando por defecto')
    ENV = config.ENV
    PORT = config.PORT
}

// const MongoClient = require('mongodb').MongoClient

// if ( ENV === 'development'){
//     const mongoUrl = 'mongodb://localhost:27017/test';
// }
//
// const mongoUrl = process.env.MONGO_URL
//
// app.get('/', (req, res) => {
//     MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
//         if (err) {
//             res.status(500).send('💥 BOOOM 💥: ' + err);
//         } else {
//             res.send('¡Mongoo coneccted! 😎');
//             db.close();
//         }
//     });
// });

app.use(express.json())
productsAPI(app)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}! =>"${ENV}"<=`))
