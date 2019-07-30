import { Router } from "express";
import array from "lodash/array";
import collection from "lodash/collection";

import { respond, error, isAuthenticated, toObjectId } from "../../../helpers/utils";
import { lastScreenshot } from "../../../helpers/log";
import Job from "../../../models/job";

const lastActivity = async (_employee, _jobIds) => {
    return {
        employee: _employee,
        activity: await lastScreenshot(_employee.user._id, _jobIds)
    };
};

const get = () => {
    return (_req, _res, _next) => {
        let param = [{ owner: toObjectId(_req.user._id) }, { managers: { $elemMatch: { user: toObjectId(_req.user._id) } } }];

        if (_req.params._jobId !== "all") {
            param.push({ _id: toObjectId(_req.params.jobId) });
        }

        return Job.find({
            $or: param
        })
            .populate("freelancers.user", "profile")
            .then(_jobs => {
                // let jobIds = _jobs.map(_job => _job._id);
                let employees = collection.sortBy(array.uniqBy(_jobs.map(_job => _job.freelancers).flat(), "user._id"), _emp => _emp.user.profile.first_name);
                _req.responseData = employees;
                _next();
                // let promises = [];
                // promises = employees.map(_emp => lastActivity(_emp, jobIds));
                // return Promise.all(promises);
            })
            // .then(_results => {
            //     _req.responseData = _results;
            //     _next();
            // })
            .catch(_err => {
                return _next(_err);
            });
    };
};

export default () => {
    let router = Router();

    router.get("/:jobId", isAuthenticated, get(), respond(), error());

    return router;
};
