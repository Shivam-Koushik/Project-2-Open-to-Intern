const authorModel = require("../models/authorModel.js")
const jwt = require("jsonwebtoken")
const validator = require('../validator/validator')
//================================================Create Author======================================================

const createAuthor = async function (req, res) {
    try {
        const { fname, lname, title, email, password } = req.body;
        if (!(fname && lname && title && email && password)) {
            return res.status(400).send({ status: false, msg: "you have to enter all compulsory details" })
        }
        const checkMail = await authorModel.findOne({ email: email });
        if (checkMail) {
            return res.status(400).send({ status: false, msg: " duplicate email" })
        }
        if ((title !== "Mr") && (title !== "Mrs") && (title !== "Miss")) {
            return res.status(400).send({ status: false, msg: "please enter correct title eg Mr,Mrs,Miss" })
        }

        if (typeof (fname) === "string" && fname.trim().length !== 0) {
            if (typeof (lname) === "string" && lname.trim().length !== 0) {
                if (typeof (email) === "string" && email.trim().length !== 0 && validator.isValidEmail(email)) {
                    if (typeof (password) === "string" && password.trim().length !== 0 && validator.isValidPassword(password)) {
                        const savedAuthorData = await authorModel.create({ fname, lname, title, email, password });
                        if (!savedAuthorData) {
                            return res.status(400).send({ status: false, msg: "cannot create data" })
                        }
                        return res.status(201).send({ status: true, data: savedAuthorData });
                    } else { return res.status(400).send({ status: false, data: "please provide valid password, with one upper case, one lower, one number, one special character and length should be between 8 to 16 , e.g: Pass@123" }) }
                } else { return res.status(400).send({ status: false, data: "email is invalid" }) }
            } else { return res.status(400).send({ status: false, data: "lname is invalid" }) }
        } else { return res.status(400).send({ status: false, data: "fname is invalid" }) }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//================================================Author Login======================================================

const authorLogin = async function (req, res) {
    try {
        const authorData = req.body
        if (Object.keys(authorData).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide email and Password" })
        }
        if (!validator.isValidEmail(authorData.email)) {
            return res.status(400).send({ status: false, msg: "please provide valid email, e.g: example@example.com" });
        }
        if (!validator.isValidPassword(authorData.password)) {
            return res.status(400).send({ status: false, msg: "please provide valid password, with one upper case, one lower, one number, one special character and length should be between 8 to 16 , e.g: Pass@123" });
        }
        const data = await authorModel.findOne({ email: authorData.email, password: authorData.password });
        if (!data)
            return res.status(401).send({
                status: false,
                msg: "email or the password is not correct",
            })
        const token = jwt.sign(
            {
                authorId: data._id.toString(),
                admin: true,
                group: 18,
                radonProject: 3
            },
            "functionup-Project-1-Blogging-Room-18"
        );
        res.status(200).setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: token });
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.authorLogin = authorLogin
module.exports.createAuthor = createAuthor
