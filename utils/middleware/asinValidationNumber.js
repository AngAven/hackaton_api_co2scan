function validate(req){
    const { body: productRequested } = req
    const regex = new RegExp(/\w{10}/);

    console.log("Evaluation Regex ==>", regex.test(productRequested.ASIN))

    if (regex.test(productRequested.ASIN)){

    } else {
        return new Error(
            `Error Message: Can't evaluated ASIN number`);
    }
}
function asinValidationNumber(){
    return function(req, res, next){
        const error = validate(req)
        error ? next(error) : next()
    }
}

module.exports = asinValidationNumber
