const initialState = {
    status: "closed",
    workouts: "closed",
    layout: "default"
};

export const menu = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_MENU':
            return Object.assign({}, state, {
                status: "opened"
            });
        case 'CLOSE_MENU':
            return Object.assign({}, state, {
                status: "closed"
            });
        case 'OPEN_WORKOUTS':
            return Object.assign({}, state, {
                workouts: "opened"
            });
        case 'CLOSE_WORKOUTS':
            return Object.assign({}, state, {
                workouts: "closed"
            });
        case 'CHANGE_MENU_LAYOUT':
            return Object.assign({}, state, {
                layout: action.layout
            });
        default:
            return state
    }
}