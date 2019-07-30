import mongoose from "mongoose";

let jobSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        managers: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                active: {
                    type: Boolean,
                    default: true
                }
            }
        ],
        freelancers: [
            {
                user: String,
                rate: Number,
                active: {
                    type: Boolean,
                    default: true
                }
            }
        ]
    },
    {
        timestamps: true,
        toObject: { virtuals: true }
    }
);

jobSchema.virtual("freelancers.user", {
    ref: "User",
    localField: "freelancers.user",
    foreignField: "email",
    justOne: true // for many-to-1 relationships
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
