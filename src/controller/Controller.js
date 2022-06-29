const collegeModel = require("../models/collegeModel.js")
const internModel = require("../models/internModel.js")
const jwt = require("jsonwebtoken")
const validator = require('../validator/validator')

const collegeDetails = async function (req,res) {
  try { const collegeName = req.query.collegeName;
    const college = await collegeModel.findOne({name:collegeName})
    if(!college) {
        return res.status(404).send({status: false , message: "college not found"})
    }
    const  interns = await internModel.find({collegeId:college._id}).select({name: 1, email: 1, mobile :1 })
    if(!interns) {
        return res.status(404).send({status: false , message: "no interns found in given college"})
    }
    res.status(200).send({ status : false , "data": { "name": college.name, "fullName": college.fullName, "logoLink":college.logoLink, "interns": interns}})
}catch (err) {
     return res.send({ status : false , message: err.message })
}

}