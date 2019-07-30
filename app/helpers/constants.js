const createConstants = (_str) => {

    return {
        REQUEST_LOADING: `${_str}_LOADING`,
        REQUEST_SUCCESS: `${_str}_SUCCESS`,
        REQUEST_FAILURE: `${_str}_FAILURE`
    }

}

export default createConstants