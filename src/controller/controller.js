const collegeModel = require("../models/collegeModel.js")
const internModel = require("../models/internModel.js")
const validation = require('../validator/validation')
const createColleges = async function (req, res) {
    try {
        let body = req.body
        if (!validation.isValidBody(body)) return res.status(400).send({ status: false, message: "Please provide details for creation" })

        if (!body.name) return res.status(400).send({ status: false, message: "name is required" })
        let name = await collegeModel.findOne({ name: body.name })
        if (name) return res.status(400).send({ status: false, message: "this college name is already exist" })
        if (!validation.isValid(body.name)) return res.status(400).send({ status: false, message: "name is not in the valid formate" })

        if (!body.fullName) return res.status(400).send({ status: false, message: "fullName is required" })
        if (!validation.isValid(body.fullName)) return res.status(400).send({ status: false, message: "fullName is not in the valid formate" })

        if (!body.logoLink) return res.status(400).send({ status: false, message: "logoLink is required" })

        const data = await collegeModel.create(body)
        return res.status(201).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const createIntern = async function (req, res) {
    try {
         const { name , email , mobile, collegeName } = req.body
         let collegeId ;

        if (!validation.isValidBody(req.body)) return res.status(400).send({ status: false, message: "Please provide details for creation" })

        if (!name) return res.status(400).send({ status: false, message: "name is required" })
        if (!validation.isValid(name)) return res.status(400).send({ status: false, message: "name is not in the valid formate" })

        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        const Email = await internModel.findOne({ email: email })
        if (Email) return res.status(400).send({ status: false, message: "this email is already exist" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "provide valid email" })

        if (!mobile) return res.status(400).send({ status: false, message: "mobile is required" })
        if (!validation.isValidMobile(mobile)) return res.status(400).send({ status: false, message: "provide valid mobile" })
        let Mobile = await internModel.findOne({ mobile: mobile })
        if (Mobile) return res.status(400).send({ status: false, message: "this mobile is already exist" })

        if(collegeName){
        let college = await collegeModel.findOne({ $or : [{name : collegeName},{ fullName : collegeName }]})
        if (!college) return res.status(404).send({ status: false, message: "no college with this college name found" })
        collegeId = college._id
        if (!validation.isValidId(college._id)) return res.status(400).send({ status: false, message: "Id is not in the valid formate" })}
         
        const createIntern = { name , email , mobile, collegeId}
        const data = await internModel.create(createIntern)
        return res.status(201).send({ status: true, data: data })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const collegeDetails = async function (req, res) {
    try {
        let query = req.query
        if (!validation.isValidBody(query)) return res.status(400).send({ status: false, message: "Provide details" })
        if (!validation.isValid(query.collegeName)) return res.status(400).send({ status: false, message: "Provide valid query" })
        const college = await collegeModel.findOne({ name: query["collegeName"] })
        if (!college) {
            return res.status(404).send({ status: false, message: "college not found" })
        }
        const interns = await internModel.find({ collegeId: college._id }).select({ name: 1, email: 1, mobile: 1 })
        if (!interns) {
            return res.status(404).send({ status: false, message: "no interns found in given college" })
        }
        res.status(200).send({
            status: true, "data": { "name": college.name, "fullName": college.fullName, "logoLink": college.logoLink, "interns": interns }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.collegeDetails = collegeDetails
module.exports.createColleges = createColleges
module.exports.createIntern = createIntern