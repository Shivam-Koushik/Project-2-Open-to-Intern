const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose')
const validator = require('../validator/validator')
const jwt = require("jsonwebtoken")

//================================================Create a Blogg======================================================
const createBlog = async function (req, res) {
    try {
        const id = req.body.authorId
        let data = { title, body, authorId, category, tags, subcategory, isPublished } = req.body
        // validation start
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "invalid request put valid data in body" })
        }
        if (tags || tags == "") {
            if (!validator.isValidArray(tags)) {
                return res.status(400).send({ status: false, msg: "tags must be  array of string " })
            }
        }
        if (subcategory || subcategory == "") {
            if (!validator.isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory must be  array of string" })
            }
        }
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: " title required ( In string) " })
        }
        if (!validator.isValid(body)) {
            return res.status(400).send({ status: false, msg: "body Required ( In string)" })
        }
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, msg: "category required ( In string)" })

        }
        if (isPublished || isPublished == "" || isPublished == false) {
            if (typeof isPublished !== "boolean") {
                return res.status(400).send({ status: false, msg: " is published should have boolean value" })
            }
            if (isPublished == true) {
                data = { title, body, authorId, category, tags, subcategory, isPublished: true, publishedAt: new Date() }
            }
            if (isPublished == false) {
                data = ({ title, body, authorId, category, tags, subcategory, isPublished: false })
            }
        }
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "AuthorId invalid  or not present " })
        }
        const findAuthor = await authorModel.findById(id)
        if (!findAuthor) {
            return res.status(400).send("Author not exists")
        }
        // validation end
        const saveData = await blogModel.create(data)
        return res.status(201).send({ status: true, data: saveData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//================================================Get Blogg======================================================

const getBlog = async function (req, res) {
    try {
        const filterData = { isDeleted: false, isPublished: true }

        const { category, tags, subcategory, authorId } = req.query

        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, msg: "invalid request put value in query params" })
        }
        if (authorId) {
            if (!mongoose.Types.ObjectId.isValid(authorId)) {
                return res.status(400).send({ status: false, msg: "invalid author Id" })
            } else filterData["authorId"] = authorId
        }

        if (validator.isValid(category)) {
            filterData["category"] = category
        }
        if (validator.isValid(tags)) {
            const tagArr = tags.trim().split(",").map(tags => tags.trim())
            filterData["tags"] = { $all: tagArr }
        }
        if (subcategory) {
            const subcategoryArr = subcategory.trim().split(",").map(subcategory => subcategory.trim())
            filterData["subcategory"] = { $all: subcategoryArr }
        }

        const blogs = await blogModel.find(filterData)
        if (Array.isArray(blogs) && blogs.length == 0) {
            return res.status(404).send({ status: false, msg: " no blogs found " })
        }
        return res.status(200).send({ status: true, data: blogs })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//================================================Update Blog======================================================

const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const bodyData = req.body;
        const { title, body, tags, subcategory } = bodyData;
        if (Object.keys(bodyData).length == 0) {
            return res.status(400).send(
                { status: false, message: "There is no data  in body Please provide some details" });
        }
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send({ status: false, msg: "BlogId invalid " })
        }
        if (title || title === "") {
            if (!validator.isValid(title)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Title is required " });
            }
        }
        if (body || body === "") {
            if (!validator.isValid(body)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Body is required " });
            }
        }
        if (tags || tags === "") {
            if (!validator.isValidArray(tags)) {
                return res
                    .status(400)
                    .send({ status: false, message: "tags is required " });
            }
        }
        if (subcategory || subcategory === "") {
            if (!validator.isValidArray(subcategory)) {
                return res.status(400).send({
                    status: false,
                    message: "subcategory is required ",
                });
            }
        }
        const Blog = await blogModel.findOne({ _id: blogId, isDeleted: false });
        if (!Blog) {
            return res.status(400).send({ status: false, msg: "No such blog found" });
        }
        const updatedBlog = await blogModel.findByIdAndUpdate({ _id: blogId },
            {
                title: title, body: body, $addToSet: { tags: tags, subcategory: subcategory },
                isPublished: true, publishedAt: new Date()
            }, { new: true });
        if (updateBlog) {
            res.status(200).send({ status: true, message: "Successfully updated blog details", data: updatedBlog, });
        }
        else {
            res.status(404).send({ status: false, msg: "blog not found" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message, });
    }
}

//================================================Delete a Blog by bloggId======================================================

const deleteBlogById = async function (req, res) {
    try {
        const bloggId = req.params.blogId
        if (mongoose.Types.ObjectId.isValid(bloggId)) {
            const bloggDetails = await blogModel.findById(bloggId)
            if (!bloggDetails) {
                res.status(404).send({ status: false, msg: "Blogg Data is Not Available" })
            }
            else {
                if (bloggDetails.isDeleted == true) {
                    res.status(400).send({ status: false, msg: "Data Already Deleted" })
                }
                else {
                    await blogModel.findByIdAndUpdate({ _id: bloggId }, { isDeleted: true, deletedAt: new Date() })
                    res.status(200).send()
                }
            }
        }
        else {
            res.status(400).send({ status: true, msg: "Blogg ID is Not Valid" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//================================================Delete a Blogg by Query Params======================================================

const deleteBlogByQueryParams = async function (req, res) {
    try {
        const { category, authorId, tags, subcategory, isPublished } = req.query
        const filterQuery = { isDeleted: false, deletedAt: null }
        if (!Object.keys(req.query).length == 0) {
            if (authorId || authorId == "") {
                if (!mongoose.Types.ObjectId.isValid(authorId)) {
                    return res.status(400).send({ status: false, msg: "invalid AuthorID" })
                }
                filterQuery['authorId'] = authorId
            }
            if (isPublished) {
                filterQuery['isPublished'] = isPublished
            }
            if (category) {
                filterQuery['category'] = category
            }
            if (tags) {
                const tagsArr = tags.trim().split(',').map(tag => tag.trim())
                filterQuery['tags'] = { $all: tagsArr }
            }
            if (subcategory) {
                const subcategoryArr = subcategory.trim().split(',').map(subcategory => subcategory.trim())
                filterQuery['subcategory'] = { $all: subcategoryArr }
            }
            const bloggDetails = await blogModel.find(filterQuery)
            if (Object.keys(bloggDetails).length == 0) {
                res.status(404).send({ status: false, msg: "Blog Data is Not Available" })
            }
            else {
                const token = req.headers["x-api-key"]
                const decodedToken = jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
                let allDeleteData = []
                for (let i = 0; i < bloggDetails.length; i++) {
                    if (decodedToken.authorId == bloggDetails[i].authorId) {
                        const deleteData = await blogModel.findByIdAndUpdate({ _id: bloggDetails[i]._id },
                            { isDeleted: true, deletedAt: new Date() })
                        allDeleteData.push(deleteData)
                    }
                }
                if (allDeleteData.length == 0) {
                    res.status(404).send({ status: false, msg: "Blog Data is Not Available" })
                }
                else {
                    res.status(200).send()
                }
            }
        }
        else {
            res.status(400).send({ status: false, msg: "please enter query to delete" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteBlogByQueryParams = deleteBlogByQueryParams
