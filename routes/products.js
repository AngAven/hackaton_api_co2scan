const express = require('express')

function productsAPI(app){
    const router = express.Router()
    console.log('cargado')

    app.use('/api/products', router)

    router.get('/', (req, res, next) => {
        try {
            const { tags } = req.query
            console.log('Tags ===>', tags)
            res.status(200).json({
                data: {"product": "other"},
                message: 'Movies listed'
            })
        } catch (e){
            next(e)
        }
    })

    router.post('/',(req, res, next) => {
        try {
            const { body: productSend } = req
            console.log('Product send', productSend)
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
