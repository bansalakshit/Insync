import mongoose from "mongoose";

let jobInvitationSchema = new mongoose.Schema({
    email: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    hash: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
}, {
    timestamps: true
});

const JobInvitation = mongoose.model('JobInvitation', jobInvitationSchema);

export default JobInvitation;