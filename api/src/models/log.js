import mongoose from "mongoose"

let logSchema = new mongoose.Schema({
    task: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    screenshots: [String],
    start: Date,
    end: Date
}, {
    timestamps: true
})

const Log = mongoose.model('Log', logSchema)

export default Log