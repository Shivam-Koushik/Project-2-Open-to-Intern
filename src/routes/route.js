const express = require('express');
const router = express.Router();
const Controller = require("../controller/controller")


router.post("/colleges",Controller.createColleges)
router.post("/intern",Controller.createIntern)


module.exports = router;
