import mongoose from "mongoose"

let taskSchema = new mongoose.Schema({
    description: String,
    link: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    tags: [String],
    priority: Number,
    freelancers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['on-going', 'completed'],
                default: 'on-going'
            },
            active: {
                type: Boolean,
                default: true
            }
        }
    ]
}, {
    timestamps: true,
})

const Task = mongoose.model('Task', taskSchema)

export default Task