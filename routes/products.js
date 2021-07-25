const express = require('express')

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

    router.post('/',(req, res, next) => {
        const { body: productRequested } = req
        try {
            console.log('Product requested ===>', productRequested)
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
