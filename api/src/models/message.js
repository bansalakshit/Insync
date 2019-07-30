import mongoose from "mongoose";

let messageSchema = new mongoose.Schema({
    text: String,
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['new', 'viewed'],
        default: 'new'
    },
    views: [String],
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;