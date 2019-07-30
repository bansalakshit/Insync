import mongoose from "mongoose"

let configSchema = new mongoose.Schema({
    appVersion: String,
})

const Config = mongoose.model('Config', configSchema)

export default Config