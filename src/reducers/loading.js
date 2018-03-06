const initialState = {
    status: "LOADING",
    overlay: false
};

export const loading = (state = initialState, action) => {
    switch (action.type) {
        case "WILL_LOAD":
            return Object.assign({}, state, {
                status: "WILL_LOAD"
            });
        case "IS_LOADING":
            return Object.assign({}, state, {
                status: "LOADING"
            });
        case "NOT_LOADING":
            return Object.assign({}, state, {
                status: "NO_LOAD"
            });
        case "DONE_LOADING":
            return Object.assign({}, state, {
                status: "DONE_LOADING"
            });
        case "SET_OVERLAY":
            return Object.assign({}, state, {
                overlay: action.value
            });
        default:
            return state;
    }
};
