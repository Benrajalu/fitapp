const initialState = {
    status: "closed",
    data: false
};

export const modals = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN_MODAL":
            return Object.assign({}, state, {
                status: "opened"
            });
        case "CLOSE_MODAL":
            return Object.assign({}, state, {
                status: "closed"
            });
        case "FEED_MODAL":
            return Object.assign({}, state, {
                data: action.data
            });
        case "CLEAN_MODAL":
            return Object.assign({}, state, {
                data: false
            });
        default:
            return state;
    }
};
