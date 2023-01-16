const mongoose = require("mongoose")

var records = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    percent: {
       type: [String],
       validate: {
           validator: v => v.length == 2,
           message: () => console.log("Please only add 2 values for the percentage!")
       },
       required: true
    },
    listpercent: Boolean,
    deleted: Boolean,
    verification: Boolean,
    screenshot: {
        type: Boolean,
        required: true
    },
    link: {
        type: String,
        required: false
    },
    hertz: {
        type: Number,
        required: false
    }
})

var levelsSchema = new mongoose.Schema({
    position: Number,
    name: {
        type: String,
        required: true
    },
    ytcode: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    verifier: {
        type: String,
        required: true
    },
    list: {
        type: [records],
        required: true
    }
})

module.exports = mongoose.model("levels", levelsSchema)