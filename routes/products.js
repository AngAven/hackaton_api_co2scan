const express = require('express')
const asinValidationNumber = require('../utils/middleware/asinValidationNumber')

function productsAPI(app){
    const router = express.Router()

    app.use('/api/products', router)

    router.get('/', (req, res, next) => {
        try {
            const { tags } = req.query
            console.log('Tags ===>', tags)
            res.status(200).json({
                data: {"Products": "List"},
                message: 'Movies listed'
            })
        } catch (e){
            next(e)
        }
    })

    router.post('/', asinValidationNumber(), (req, res, next) => {
        const { body: productRequested } = req

            try {
                res.status(201).json({
                    data: {"algo": "otro"},
                    message: 'Product Submited'
                })
            } catch (e) {
                next(e)
            }
    })
}

module.exports = productsAPI
