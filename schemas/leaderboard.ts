import mongoose from "mongoose"

var leaderboard = new mongoose.Schema<any>({
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

export default mongoose.models.leaderboard || mongoose.model("leaderboard", leaderboard)