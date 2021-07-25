const express = require('express')
const puppeteer = require('puppeteer')
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

    router.get('/fake/:productASIN', (req, res, next) => {
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

    router.post('/fake', asinValidationNumber(), (req, res, next) => {
        const { body: productRequested } = req

        try {
            res.status(201).json(productsMock)
        } catch (e) {
            next(e)
        }
    })

    router.get('/:productASIN', (req, res, next) => {
        const { productASIN } = req.params
        const url = 'https://www.amazon.com.mx/dp/' + productASIN

        async function run(){
            const browser = await puppeteer.launch()
            const page = await browser.newPage()

            async function getData(){
                await page.goto(`${url}`)

                const data = await page.evaluate((productASIN) => {
                    const baseURL = 'https://www.amazon.com.mx/'
                    const similarProducts = []
                    const product = []
                    const $similarProducts = document.querySelectorAll('.comparison_table_image_row th')

                    $similarProducts.forEach($product => {
                        if ($product.getAttribute('data-asin').trim() !== productASIN.trim()){
                            similarProducts.push({
                                asin_number: $product.getAttribute('data-asin'),
                                product_name: $product.querySelector('.a-size-base').textContent,
                                product_url: baseURL + $product.querySelector('.a-link-normal').getAttribute("href"),
                                product_image: $product.querySelector('img').getAttribute('src')
                            })
                        }
                    })

                    return {
                        product,
                        similarProducts
                    }
                }, productASIN)

                return data
            }

            res.status(200).json(await getData())

            await browser.close()
        }

        run()
    })
}

module.exports = productsAPI
