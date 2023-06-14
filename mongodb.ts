import mongoose from "mongoose";
import levs from "schemas/levels"
import lead from "schemas/leaderboard"
mongoose.connection || mongoose.connect(process.env.MONGODB_URI as string);

export const levels = levs
export const leaderboard = lead