import { Router } from "express";
import moment from "moment";
import _ from "lodash/collection";
import { respond, error, isAuthenticated, toObjectId } from "../../../helpers/utils";
import { getEmployeesID, getLastSixLogs } from "../../../helpers/log";
import { getUserJobIds } from "../../../helpers/job";
import Log from "../../../models/log";

const getJobs = async (_userId, _jobId) => {
    if(_jobId === 'all') {
        return await getUserJobIds(_userId);
    } else {
        return [toObjectId(_jobId)];
    }
}

const get = () => {
    return (_req, _res, _next) => {
        let jobIds = [];
        return getJobs(_req.user._id, _req.params.jobId)
            .then(_jobIds => {
                jobIds = _jobIds;
                return getEmployeesID(_req.user._id, _jobIds);
            })
            .then(_employees => {
                let now = moment();
                let end = new Date(now.format("YYYY-MM-DD HH:mm:ss"));
                let start = new Date(now.subtract(72, "months").format("YYYY-MM-DD HH:mm:ss"));
                Log.aggregate([
                    {
                        $match: {
                            $and: [{ user: { $in: _employees } }, { end: { $gte: start } }, { end: { $lte: end } }]
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            users: { $addToSet: "$user" }
                        }
                    }
                ]).exec((err, result) => {
                    if (err) {
                        console.log(err);
                        _next(err);
                    } else {
                        if (result && result.length > 0 && result[0].users.length > 0) {
                            let promises = [];
                            result[0].users.forEach(_id => {
                                promises.push(getLastSixLogs(_id, jobIds));
                            });
                            Promise.all(promises)
                                .then(_results => {
                                    _req.responseData = _.sortBy(_results, u => u.profile.first_name);
                                    _next();
                                })
                                .catch(_err => {
                                    return _next(_err);
                                });
                        } else {
                            _req.responseData = result;
                            _next();
                        }
                    }
                });
            })
            .catch(_err => _next(_err));
    };
};

export default () => {
    let router = Router();

    router.get("/screenshots/:jobId?", isAuthenticated, get(), respond(), error());

    return router;
};
