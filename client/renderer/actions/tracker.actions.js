import { trackerConstants } from '../constants'

export const trackerActions = {
    run,
    stop
}

function run() {
    return { type: trackerConstants.RUNNING }
}

function stop() {
    return { type: trackerConstants.STOP }
}