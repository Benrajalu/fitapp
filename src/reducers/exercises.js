const initialState = {
    list: []
};

export const exercises = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_EXERCISES_DATABASE':
            return Object.assign({}, state, {
                list: action.list
            });
        default:
            return state
    }
}