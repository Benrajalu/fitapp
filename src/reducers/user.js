const initialState = {
    displayName: null,
    profilePicture: false,
    uid: 0,
    signinEmail: null,
    settings: {},
    deleting: false
};

export const user = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER_NAME":
            return Object.assign({}, state, {
                displayName: action.displayName
            });
        case "SET_USER_AVATAR":
            return Object.assign({}, state, {
                profilePicture: action.profilePicture
            });
        case "SET_USER_SETTINGS":
            return Object.assign({}, state, {
                settings: action.settings
            });
        case "SET_USER_CONTACT_EMAIL":
            return Object.assign({}, state, {
                contactEmail: action.contactEmail
            });
        case "SET_USER_SIGNIN_EMAIL":
            return Object.assign({}, state, {
                signinEmail: action.signinEmail
            });
        case "SET_USER_UID":
            return Object.assign({}, state, {
                uid: action.uid
            });
        case "SET_USER_WEIGHT":
            return Object.assign({}, state, {
                userWeight: action.userWeight
            });
        case "REMOVE_USER":
            return Object.assign({}, state, {
                deleting: true
            });
        case "REMOVE_USER_DELETE":
            return Object.assign({}, state, {
                deleting: false
            });
        default:
            return state;
    }
};
