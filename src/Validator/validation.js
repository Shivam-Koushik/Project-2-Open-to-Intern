const mongoose = require('mongoose')

const isValid = function (x) {
    if (typeof x === 'undefined' || x === null) return false
    if (typeof x === 'string' && x.trim().length === 0) return false
    return true
}

const isValidBody = function (y) {
    return Object.keys(y).length > 0
}

const isValidEmail = function (y) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailRegex.test(y)) return true
}

const isValidMobile = function (y) {
    
   let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[0-9]\d{9}$/
   if (mobileRegex.test(y)) return true
}


const isValidId = function(y){
   return mongoose.Types.ObjectId.isValid(y) 
}


module.exports.isValidBody = isValidBody
module.exports.isValid = isValid
module.exports.isValidEmail = isValidEmail
module.exports.isValidMobile = isValidMobile
module.exports.isValidId = isValidId