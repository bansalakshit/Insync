import Job from "../models/job";
import User from "../models/user";
import { toObjectId } from "./utils";

export async function isJobOwner(_userId, _jobId) {
    let job = await Job.findOne({
        owner: toObjectId(_userId),
        _id: toObjectId(_jobId)
    });
    return job ? true : false;
}

export async function getUserJobIds(_ownerId) {
    let results = await Job.find({ 
        $or: [
            { owner: toObjectId(_ownerId) },
            { managers: { $elemMatch: { user: toObjectId(_ownerId) } } }
        ]
     });
    return results.map(_r => _r._id);
}

export async function getFreelancerJobIds(_freelancerId) {
    let user = await User.findById(_freelancerId).select('email');
    let results = await Job.find({freelancers: {$elemMatch: {user: user.email}}});
    return results.map(_r => _r._id);
}
