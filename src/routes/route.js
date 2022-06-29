const express = require('express');
const router = express.Router();
const Controller = require("../controller/authorController")

const auth = require("../middleware/auth")


router.post('/functionup/colleges', authorController.createCollege)

router.post('/functionup/interns', auth.authenticate, Controller.createIntern)

router.post("")

module.exports = router;
