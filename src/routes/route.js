const express = require('express');
const router = express.Router();
const Controller = require("../controller/controller")


router.post("/colleges",Controller.createColleges)
router.post("/interns",Controller.createIntern)
router.get("/collegeDetails",Controller.collegeDetails)

module.exports = router;