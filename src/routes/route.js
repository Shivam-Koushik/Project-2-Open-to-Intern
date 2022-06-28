const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const auth = require("../middleware/auth")


router.post('/authors', authorController.createAuthor)

router.post('/blogs', auth.authenticate, blogController.createBlog)

router.get('/blogs', auth.authenticate, blogController.getBlog)

router.put('/blogs/:blogId',auth.authenticate, auth.authorise, blogController.updateBlog)

router.delete('/blogs/:blogId', auth.authenticate, auth.authorise, blogController.deleteBlogById)

router.delete('/blogs', auth.authenticate, blogController.deleteBlogByQueryParams)

router.post('/login', authorController.authorLogin)

module.exports = router;
