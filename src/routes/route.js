const express = require('express');
const router = express.Router();
const Controller = require("../controller/controller")


router.post("/colleges",Controller.createColleges)
router.post("/intern",Controller.createIntern)
router.post("/collegeDetails",Controller.collegeDetails)

module.exports = router;
