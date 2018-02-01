const initialState = {
    list:[], 
    records:[]
};

export const workoutLogs = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALL_LOGS':
            return Object.assign({}, state, {
                list: action.workoutLogs
            });
        case 'GET_ALL_RECORDS':
            return Object.assign({}, state, {
                records: action.records
            });
        default:
            return state
    }
}