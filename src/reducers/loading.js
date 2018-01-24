const initialState = {
    status: "LOADING"
};

export const loading = (state = initialState, action) => {
    switch (action.type) {
        case 'WILL_LOAD':
            return Object.assign({}, state, {
                status: 'WILL_LOAD'
            });
        case 'IS_LOADING':
            return Object.assign({}, state, {
                status: 'LOADING'
            });
        case 'NOT_LOADING':
            return Object.assign({}, state, {
                status: 'NO_LOAD'
            });
        case 'DONE_LOADING':
            return Object.assign({}, state, {
                status: 'DONE_LOADING'
            });
        default:
            return state
    }
}