import { liveConstants } from "../constants";

export function live(
    state = {
        job: "all",
        user: null,
        updateId: new Date().getTime(),
        data: [],
        origData: [],
        loading: false
    },
    action
) {
    switch (action.type) {
        case liveConstants.SEARCHED:
            let temp = [];
            if (action.payload.data.trim() === "") {
                temp = state.origData;
            } else {
                temp = state.data.filter(_user => (_user.profile.first_name+' '+_user.profile.last_name).toLowerCase().search(action.payload.data.trim().toLowerCase()) >= 0);
            }
            return {
                ...state,
                user: (temp.length > 0) ? temp[0] : null,
                data: temp
            };
        case liveConstants.EMPLOYEES_LOADING:
            return {
                ...state,
                user: null,
                loading: true,
                error: false
            };
        case liveConstants.EMPLOYEES_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                user: (action.payload.data.length > 0) ? action.payload.data[0] : null,
                data: action.payload.data,
                origData: action.payload.data,
            };
        case liveConstants.EMPLOYEES_FAILURE:
            return {
                ...state,
                user: null,
                loading: false,
                error: true
            };

        case liveConstants.JOB_CHANGED:
            return {
                ...state,
                user: null,
                job: action.payload.data,
                updateId: new Date().getTime()
            };
        case liveConstants.USER_CHANGED:
            return {
                ...state,
                user: action.payload.data
            };

        default:
            return state;
    }
}
