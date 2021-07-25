function validate(req){
    const { body: productRequested } = req
    const jsonASINRequest = JSON.stringify(productRequested)
    const regex = new RegExp(/\w{10}/)

    const asinNumberValid = JSON.parse(jsonASINRequest, (key, value) => {
        if (key === 'asin'){
            if (regex.test(value)) {
                return value.toUpperCase();
            }
            return true
        }
        return value;
    })
    console.log('ASIN numbers validated')
    return false
}

function asinValidationNumber(){
    return function(req, res, next){
        const error = validate(req)
        error ? next(error) : next()
        next()
    }
}

module.exports = asinValidationNumber
