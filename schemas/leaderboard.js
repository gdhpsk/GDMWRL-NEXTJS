const mongoose = require("mongoose")

var leaderboard = new mongoose.Schema({
    nationality: String,
    minus: Number,
    socials: mongoose.SchemaTypes.Mixed,
    records: {
        type: Array,
        required: false
    }, 
    completions: {
        type: Array,
        required: false
    },
    extralist: {
        type: Array,
        required: false 
    },
    screenshot: Array,
    name: String
})

module.exports = mongoose.models.leaderboard || mongoose.model("leaderboard", leaderboard)