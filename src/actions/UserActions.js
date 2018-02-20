import {
  watchLogs,
  watchRecords,
  resetLogs,
  resetRecords
} from "./WorkoutLogActions";
import { watchRoutines, resetRoutines } from "./RoutinesActions";
import { watchExercises } from "./ExercisesActions";

// Login actions
export const setUserName = displayName => ({
  type: "SET_USER_NAME",
  displayName: displayName
});

export const setUserContactEmail = contactEmail => ({
  type: "SET_USER_CONTACT_EMAIL",
  contactEmail: contactEmail
});

export const setUserSigninEmail = signinEmail => ({
  type: "SET_USER_SIGNIN_EMAIL",
  signinEmail: signinEmail
});

export const setUserProfilePicture = profilePicture => ({
  type: "SET_USER_AVATAR",
  profilePicture: profilePicture
});

export const setUserSettings = settings => ({
  type: "SET_USER_SETTINGS",
  settings: settings
});

export const setUserUid = uid => ({
  type: "SET_USER_UID",
  uid: uid
});

export const removeUser = () => ({
  type: "REMOVE_USER"
});

export const cancelUserDelete = () => ({
  type: "REMOVE_USER_DELETE"
});

export function authenticateUser(data) {
  // Redux Thunk will inject dispatch here:
  const displayName = data.displayName,
    contactEmail = data.contactEmail,
    profilePicture = data.profilePicture,
    signinEmail = data.signinEmail,
    uid = data.uid,
    settings = data.settings;

  return dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(setUserName(displayName));
    dispatch(setUserContactEmail(contactEmail));
    dispatch(setUserSigninEmail(signinEmail));
    dispatch(setUserProfilePicture(profilePicture));
    dispatch(setUserSettings(settings));
    dispatch(setUserUid(uid));
    dispatch(watchRoutines());
    dispatch(watchLogs());
    dispatch(watchExercises());
    dispatch(watchRecords());
  };
}

export function resetUser() {
  // Redux Thunk will inject dispatch here:

  return dispatch => {
    const empty = null;
    const emptyObject = {};
    // Reducers may handle this to set a flag like isFetching
    dispatch(setUserName(empty));
    dispatch(setUserContactEmail(empty));
    dispatch(setUserSigninEmail(empty));
    dispatch(setUserProfilePicture(empty));
    dispatch(setUserSettings(emptyObject));
    dispatch(cancelUserDelete());
    dispatch(setUserUid(false));
    dispatch(resetRoutines());
    dispatch(resetLogs());
    dispatch(resetRecords());
  };
}
