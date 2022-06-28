const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
        name: { type: String, required: true },
        lname: { type: String, required: true },
        title: {
                type: String, required: true,
                enum: ["Mr", "Mrs", "Miss"]
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }


}, { timestamps: true });

module.exports = mongoose.model