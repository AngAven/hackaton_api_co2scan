const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const MongoClient = require('mongodb').MongoClient
const { ENV, PORT } = process.env;

// Connection URL
if ( ENV === 'development'){
    const mongoUrl = 'mongodb://localhost:27017/test';
}

const mongoUrl = process.env.MONGO_URL

app.get('/', (req, res) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            res.status(500).send('💥 BOOOM 💥: ' + err);
        } else {
            res.send('Mongoo coneccted! 😎');
            db.close();
        }
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))
