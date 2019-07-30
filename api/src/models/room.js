import mongoose from "mongoose";

let roomSchema = new mongoose.Schema({
    name: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }, 
        role: {
            type: String,
            enum: ['employee', 'manager', 'employeer'],
            default: 'employee'
        }
    }],
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

export default Room;