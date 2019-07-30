import { Router } from "express";
import {
    respond,
    error,
    convertError,
    isAuthenticated,
    toObjectId
} from "../../../helpers/utils";
import Job from "../../../models/job";

let freelancer = () => {
    return (_req, _res, _next) => {
        return Job.find({
            freelancers: { $elemMatch: { user: _req.user.email, active: true } }
        })
            .select("title description owner createdAt")
            .populate("owner", "profile username")
            .sort({ _id: 1 })
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let get = () => {
    return (_req, _res, _next) => {
        return Job.find({ 
                $or: [
                    { managers: { $elemMatch: { user: toObjectId(_req.user._id) } } },
                    { owner: toObjectId(_req.user._id)  }
                ]
            })
            .populate("freelancers.user", "profile username")
            .populate("managers.user", "profile username")
            .sort({ _id: 1 })
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let list = () => {
    return (_req, _res, _next) => {
        return Job.find({ 
                $or: [
                    { managers: { $elemMatch: { user: toObjectId(_req.user._id) } } },
                    { owner: toObjectId(_req.user._id)  }
                ]
            })
            .then(_result => {
                _req.responseData = _result;
                _next();
            })
            .catch(_err => {
                return _next(_err);
            });
    };
};

let create = () => {
    return (_req, _res, _next) => {
        _req.assert("title", "Title cannot be blank").notEmpty();
        _req.assert("description", "Description cannot be blank").notEmpty();

        const errors = _req.validationErrors();

        if (errors) {
            return _next(convertError(errors));
        }

        return Job.create({
            title: _req.body.title,
            description: _req.body.description,
            owner: _req.user._id
        })
            .then(() => {
                _req.responseData = {
                    success: true,
                    message: "Job was created successfully."
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

    router.get("/", isAuthenticated, get(), respond(), error());

    router.get("/list", isAuthenticated, list(), respond(), error());

    router.get(
        "/freelancer",
        isAuthenticated,
        freelancer(),
        respond(),
        error()
    );

    router.post("/", isAuthenticated, create(), respond(), error());

    return router;
};
