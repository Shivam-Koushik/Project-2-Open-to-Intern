const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel")
const mongoose = require("mongoose")

//================================================Authentication======================================================

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]

        if (!token) {
            res.status(400).send({ status: false, msg: "token must be present" })
        }
        else {
            const validToken = jwt.decode(token)
            if (validToken) {
                try {
                    jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
                    next()
                }
                catch (error) {
                    res.status(401).send({ status: false, msg: "Invalid token" })
                }
            }
            else {
                res.status(400).send({ status: false, msg: "Invalid token" })
            }
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//================================================Authorisation======================================================

const authorise = async function (req, res, next) {
    try {
        const blogIdParams = req.params.blogId
        if (!mongoose.Types.ObjectId.isValid(blogIdParams)) {
            return res.status(401).send("provide valid blogId")
        }
        const data = await blogModel.findById(blogIdParams).select({ authorId: 1, _id: 0 })
        if (!data) {
            return res.status(400).send("provide valid blogId")
        }
        const token = req.headers["x-api-key"]
        const decodedToken = jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
        if (data.authorId == decodedToken.authorId) {
            next()
        }
        else {
            res.status(403).send("Authorization failed")
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorise = authorise