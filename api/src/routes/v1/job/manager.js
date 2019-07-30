import { Router } from "express";
import { respond, error, toObjectId, isAuthenticated, convertError } from "../../../helpers/utils";
import { isJobOwner } from "../../../helpers/job";
import Job from "../../../models/job";
import User from "../../../models/user";
import Room from "../../../models/room";

let validateOwner = () => {
    return (_req, _res, _next) => {
        return isJobOwner(_req.user._id, _req.params.jobId)
            .then(_isOwner => {
                if (_isOwner) {
                    _next();
                } else {
                    _next(new Error("Unauthorized"));
                }
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let validateUser = () => {
    return (_req, _res, _next) => {
        _req.assert("email", "Email cannot be blank").notEmpty();

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }

        return User.findOne({ email: _req.body.email })
            .then(_user => {
                if (_user) {
                    _req.cData = { user: _user };
                    return Job.findOne({ _id: toObjectId(_req.params.jobId), managers: { $elemMatch: { user: toObjectId(_user._id) } } });
                } else {
                    return _next(new Error("User does not exist."));
                }
            })
            .then(_job => {
                if (_job) {
                    return _next(new Error("You have already assigned this user as manager"));
                } else {
                    _next();
                }
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let add = () => {
    return (_req, _res, _next) => {
        return Job.updateOne({ _id: toObjectId(_req.params.jobId) }, { $push: { managers: { user: toObjectId(_req.cData.user._id) } } })
            .then(() => {
                return Room.updateMany({ job: toObjectId(_req.params.jobId) }, { $push: { members: { user: toObjectId(_req.cData.user._id), role: "manager" } } });
            })
            .then(() => {
                _req.responseData = {
                    message: "User was successfully assigned as manager.",
                    success: true
                };
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let remove = () => {
    return (_req, _res, _next) => {
        return Job.findOne({ _id: toObjectId(_req.params.jobId), owner: toObjectId(_req.user._id) })
            .then(_job => {
                if (!_job) {
                    return _next(new Error("Invalid Job ID"));
                } else {
                    return Job.updateOne(
                        {
                            $and: [{ _id: toObjectId(_req.params.jobId) }, { owner: toObjectId(_req.user._id) }, { "managers.user": toObjectId(_req.params.userId) }]
                        },
                        {
                            $pull: { managers: { user: _req.params.userId } }
                        }
                    );
                }
            })
            .then(() => {
                return Room.updateMany({ 
                    $and: [
                        { job: toObjectId(_req.params.jobId) }, 
                        { "members.user": toObjectId(_req.params.userId) }
                    ] 
                }, { 
                    $pull: { 
                        members: { user: toObjectId(_req.params.userId) } 
                    } 
                });
            })
            .then(() => {
                _req.responseData = {
                    success: true,
                    message: "Manager was removed from job."
                };
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

export default () => {
    let router = Router();

    router.post("/:jobId/new", isAuthenticated, validateUser(), validateOwner(), add(), respond(), error());
    router.get("/:jobId/remove/:userId", isAuthenticated, remove(), respond(), error());

    return router;
};
