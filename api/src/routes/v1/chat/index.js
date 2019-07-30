import { Router } from "express";
import messages from "./messages";
import message from "./message";
import seen from "./seen";
import unseen from "./unseen";
import room from "./room";

export default () => {
    let router = Router();

    router.use("/", messages());
    router.use("/", message());
    router.use("/seen", seen());
    router.use("/unseen", unseen());
    router.use("/room", room());

    return router;
};
