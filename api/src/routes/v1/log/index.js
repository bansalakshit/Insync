import { Router } from "express";
import create from "./create";
import list from "./list";
import logToday from "./log-today";
import logMonth from "./log-month";
import screenshots from "./screenshots";
import myScreenshots from "./my-screenshots";
import live from "./live";
import update from "./update";
import tasks from "./tasks";
import stop from "./stop";

export default () => {
    let router = Router();

    router.use("/stop", stop());
    router.use("/", create());
    router.use("/", list());
    router.use("/tasks", tasks());
    router.use("/update", update());
    router.use("/screenshots", screenshots());
    router.use("/my-screenshots", myScreenshots());
    router.use("/today", logToday());
    router.use("/month", logMonth());
    router.use("/live", live());

    return router;
};
