const initialState = {
    routines: []
};

export const routines = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALL_ROUTINES':
            return Object.assign({}, state, {
                routines: action.routines
            });
        default:
            return state
    }
}