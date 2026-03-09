import mongoose from "mongoose";
import levs from "schemas/levels"
import lead from "schemas/leaderboard"

mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: "MobileWRList",
    readPreference: "primaryPreferred",
    authSource: "$external",
    authMechanism: "MONGODB-X509",
    tlsCAFile: process.env.CA_PATH,
    tlsCertificateKeyFile: process.env.CLIENT_PEM_PATH,
} as any);

export const levels = levs
export const leaderboard = lead
