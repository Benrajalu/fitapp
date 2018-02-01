import {database} from '../store/';

// Logs actions
export const getAllLogs = (newLogs) => ({
    type: 'GET_ALL_LOGS', 
    workoutLogs: newLogs
});

// Records actions
export const getAllRecords = (newRecords) => ({
    type: 'GET_ALL_RECORDS', 
    records: newRecords
});

export function watchLogs() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const user = getState().user.uid;
    
    database.collection('users').doc(user).collection('workoutLog').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
            data.id = doc.id;
        output.push(data);
      });
      dispatch(getAllLogs(output));
    });
  }
}

export function watchRecords() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const user = getState().user.uid;
    
    database.collection('users').doc(user).collection('personalRecords').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
            data.id = doc.id;
        output.push(data);
      });
      dispatch(getAllRecords(output));
    });
  }
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