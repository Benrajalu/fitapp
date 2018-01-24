import firebase from 'firebase';
/*require("firebase/firestore");

const config = {
  apiKey: "AIzaSyCk5jCqyW5yNP32nTn5yha6PEi2wSFuCKg",
  authDomain: "fit-app-io.firebaseapp.com",
  projectId: "fit-app-io"
};

firebase.initializeApp(config);*/

//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.NONE);

export const fire = firebase;
//export const database = firebase.firestore();
export const firebaseAuth = firebase.auth();