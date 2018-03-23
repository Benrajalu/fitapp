import { database } from "../store/";

// routine actions
export const getAllRoutines = newRoutines => ({
  type: "GET_ALL_ROUTINES",
  routines: newRoutines
});

export const resetRoutines = () => ({
  type: "RESET_ROUTINES",
  routines: []
});

export function watchRoutines() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const user = getState().user.uid;

    database
      .collection("users")
      .doc(user)
      .collection("routines")
      .get()
      .then(snapshot => {
        const output = [];
        snapshot.forEach(doc => {
          let data = doc.data();
          data.id = doc.id;
          output.push(data);
        });
        dispatch(getAllRoutines(output));
      });
  };
}

/*export function resetUser() {
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
    dispatch(setUserUid(false));
  }
}*/
