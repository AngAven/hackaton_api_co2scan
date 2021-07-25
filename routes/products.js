const express = require('express')
const asinValidationNumber = require('../utils/middleware/asinValidationNumber')
const productsMock = require('../utils/data/fakeScrappingProducts')

function productsAPI(app){
    const router = express.Router()

    app.use('/api/products', router)

    router.get('/', (req, res, next) => {
        try {
            res.status(200).json(productsMock)
        } catch (e){
            next(e)
        }
    })

    router.get('/:productASIN', (req, res, next) => {
        const { productASIN } = req.params
        const regex = new RegExp(/\w{10}/)
        let productFound = ''

        if (regex.test(productASIN)) {
            productsMock.forEach(item => {
                if(item.asin === productASIN){
                    productFound = item
                }
            })

            try {
                res.status(200).json([productFound])
            } catch (e){
                next(e)
            }
        } else{
            res.status(200).json({
                message: "Not found ASIN number try again"
            })
        }

    })

    router.post('/', asinValidationNumber(), (req, res, next) => {
        const { body: productRequested } = req

            try {
                res.status(201).json(productsMock)
            } catch (e) {
                next(e)
            }
    })
}

module.exports = productsAPI
