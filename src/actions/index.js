import firebase from 'firebase';
import 'firebase/firestore';

export const setUserName = name => ({
  type: 'SET_USER_NAME',
  name
});

export const setUserAvatar = avatar => ({
  type: 'SET_USER_AVATAR',
  avatar
});

export const setUserUid = uid => ({
  type: 'SET_USER_UID',
  uid
});

export const login = dispatch => {
  console.log('coucou');
  let userObject = {};

  firebase.auth().onAuthStateChanged(
    function(user) {
      const query = firebase
        .firestore()
        .collection('users')
        .doc(user.uid);
      query.onSnapshot(doc => {
        userObject = doc.data();
        console.log(userObject);
        /*dispatch(setUserAvatar(userObject.profilePicture));
          dispatch(setUserName(userObject.displayName));
          dispatch(setUserUid(user.uid));*/
      });
    },
    error => {
      console.log('Not listenting anymore');
    }
  );
};

// loading actions
export const startLoading = () => ({
  type: 'WILL_LOAD'
});

export const isLoading = () => ({
  type: 'IS_LOADING'
});

export const stopLoading = () => ({
  type: 'DONE_LOADING'
});

export const endLoading = () => ({
  type: 'NOT_LOADING'
});

export function getLoading() {
  // Redux Thunk will inject dispatch here:
  return dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(startLoading());
    setTimeout(() => {
      dispatch(isLoading());
    }, 300);
  };
}

export function removeLoading() {
  // Redux Thunk will inject dispatch here:
  return dispatch => {
    // Reducers may handle this to set a flag like isFetching
    dispatch(stopLoading());
    setTimeout(() => {
      dispatch(endLoading());
    }, 300);
  };
}
