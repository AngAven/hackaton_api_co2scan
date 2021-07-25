require('dotenv').config()

const config = {
    ENV: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
}

module.exports = { config }
