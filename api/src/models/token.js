import mongoose from "mongoose"

let tokenSchema = new mongoose.Schema({
    hash: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    src: {
        type: String,
        enum: ['web', 'app'],
        default: 'web'
    }
}, {
    timestamps: true
})

const Token = mongoose.model('Token', tokenSchema)

export default Token