import { Router } from "express";
import collection from "lodash/collection";
import { respond, error, isAuthenticated, toObjectId } from "../../../helpers/utils";
import { logThisMonth, logThisWeek, logToday, logYesterday, lastScreenshot } from "../../../helpers/log";
import Job from "../../../models/job";
import Log from "../../../models/log";
import User from "../../../models/user";

let getLogs = async (_freelancer, _jobIds) => {
    let lastActive = await lastScreenshot(_freelancer._id, _jobIds);
    let today = await logToday(_freelancer._id, _jobIds);
    let yesterday = await logYesterday(_freelancer._id, _jobIds);
    let week = await logThisWeek(_freelancer._id, _jobIds);
    let month = await logThisMonth(_freelancer._id, _jobIds);
    return {
        lastActive: lastActive ? lastActive.end : null,
        user: _freelancer,
        logs: {
            lastActive: lastActive,
            today: today,
            yesterday: yesterday,
            week: week,
            month: month
        }
    };
};

let getInfo = () => {
    return (_req, _res, _next) => {
        let promises = [];
        _req.responseData.forEach(_info => {
            promises.push(getLogs(_info));
        });
        Promise.all(promises)
            .then(_results => {
                _req.responseData = _results;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let getLastActive = () => {
    return (_req, _res, _next) => {
        Log.aggregate([
            {
                $match: {
                    user: {
                        $in: _req.cData.freelancers
                    }
                }
            },
            {
                $sort: {
                    end: -1
                }
            },
            {
                $group: {
                    _id: { user: "$user" },
                    logs: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    lastActive: { $arrayElemAt: ["$logs", 0] }
                }
            }
        ]).exec((_err, _results) => {
            if (_err) {
                _next(_err);
            } else {
                _req.responseData = _results;
                _next();
            }
        });
    };
};

let get = () => {
    return (_req, _res, _next) => {
        let sortDirection = _req.params.sortDirection ? _req.params.sortDirection : "ASC";
        return Job.find({
                $or: [
                    { owner: toObjectId(_req.user._id) },
                    { managers: { $elemMatch: { user: toObjectId(_req.user._id) } } }
                ]
            })
            .populate("freelancers.user", "profile username")
            .then(_results => {
                let freelancers = [];
                let jobIds = [];
                _results.forEach(_result => {
                    jobIds.push(_result._id);
                    _result.freelancers.forEach(_freelancer => {
                        let IDs = freelancers.map(x => x._id);
                        if (!IDs.includes(_freelancer.user._id)) freelancers.push(_freelancer.user);
                    });
                });

                let promises = [];
                freelancers.forEach(_freelancer => {
                    promises.push(getLogs(_freelancer, jobIds));
                });
                return Promise.all(promises);
            })
            .then(_results => {
                let results = collection.sortBy(_results, ["lastActive"]);
                _req.responseData = results;
                if (sortDirection === "ASC") _req.responseData = results.reverse();
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

export default () => {
    let router = Router();

    router.get("/:sortDirection?", isAuthenticated, get(), respond(), error());

    return router;
};
