const express = require('express')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs')
const asinValidationNumber = require('../utils/middleware/asinValidationNumber')
const productsMock = require('../utils/data/fakeScrappingProducts')

function productsAPI(app){
    let $cart = []; // Retirar
    const router = express.Router()

    app.use('/api/products', router)
    puppeteer.use(StealthPlugin())

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

    router.post('/cart', (req,res,next) => {
        const { body: cart } = req
        // let products = JSON.parse(fs.readFileSync('products.json', 'utf8'))
        //
        // products({
        //     products: JSON.stringify(cart)
        // })
        //
        // fs.writeFile('products.json', JSON.stringify(cart), error => {
        //     console.log(error)
        //     next(error)
        // })

        $cart.push(cart)
        try {
            res.status(201).json($cart)
        } catch (e) {
            next(e)
        }
    } )

    router.get('/cart', (req, res, next) => {
        try {
            res.status(200).json($cart)
        } catch (e){
            next(e)
        }
    })

    router.get('/:productASIN', (req, res, next) => {
        const { productASIN } = req.params
        const url = 'https://www.amazon.com.mx/dp/' + productASIN

        async function run(){
            const browser = await puppeteer.launch({
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
            })
            const page = await browser.newPage()

            async function getData(){
                await page.goto(`${url}`)

                // try {
                    const data = await page.evaluate((productASIN) => {
                        const baseURL = 'https://www.amazon.com.mx/'
                        const similarProducts = []
                        const productInfo = []
                        const $product = document.querySelector('#ppd')
                        const $similarProducts = document.querySelectorAll('.comparison_table_image_row th')

                        // Fill product
                        const messageNoDataAviable ='No data aviable'
                        const product_name = $product.querySelector('#centerCol').querySelector('#productTitle').textContent.trim()
                        const product_image = $product.querySelector('#leftCol').querySelector('#imgTagWrapperId img').getAttribute('src')
                        const carbono_per_unit = Math.floor((Math.random() * 1000) + 1)
                        const items_buyed_unit_until_now = Math.floor((Math.random() * 10000) + 1)
                        productInfo.push({
                            asin_number: productASIN,
                            product_name: product_name
                                ? product_name
                                : messageNoDataAviable,
                            product_description: '',
                            product_image: product_image
                                ? product_image
                                : messageNoDataAviable,
                            product_url: baseURL + 'dp/' +productASIN,
                            carbono_per_unit,
                            items_buyed_unit_until_now,
                            carbono_total_accumulated: carbono_per_unit * items_buyed_unit_until_now,

                        })

                        // Fill similar products
                        $similarProducts.forEach(similarProduct => {
                            if (similarProduct.getAttribute('data-asin').trim() !== productASIN.trim()){
                                const messageNoDataAviable ='No data aviable'
                                const asin_number = similarProduct.getAttribute('data-asin')
                                const product_url = similarProduct.querySelector('.a-link-normal').getAttribute("href")
                                const product_name = similarProduct.querySelector('.a-size-base').textContent
                                const product_image = similarProduct.querySelector('img').getAttribute('src')

                                similarProducts.push({
                                    test: similarProduct.getAttribute('data-asin').trim(),
                                    asin_number: asin_number
                                        ? asin_number
                                        : messageNoDataAviable,
                                    product_name: product_name
                                        ? product_name
                                        : messageNoDataAviable,
                                    product_url: product_url
                                        ? baseURL + similarProduct.querySelector('.a-link-normal').getAttribute("href")
                                        : messageNoDataAviable,
                                    product_image: product_image
                                        ? product_image
                                        : messageNoDataAviable,
                                    carbono_per_unit: Math.floor((Math.random() * 1000) + 1)
                                })
                            }
                        })

                        return {
                            productInfo,
                            similarProducts
                        }
                    }, productASIN)

                    return data
                // } catch (error) {
                //     return error
                // }

            }

            // try {
                res.status(200).json(await getData())
                await browser.close()

            // } catch (error) {
            //     res.status(400).json({
            //         message: error
            //     })
            //     await browser.close()
            // }

        }

        run()
    })
}

module.exports = productsAPI
