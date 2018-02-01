import { createStore, applyMiddleware } from 'redux' // Use compose if need firebase again
//import { reduxFirestore } from 'redux-firestore'
import firebase from 'firebase'
import 'firebase/firestore'

import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

const config = {
  apiKey: "AIzaSyCk5jCqyW5yNP32nTn5yha6PEi2wSFuCKg",
  authDomain: "fit-app-io.firebaseapp.com",
  projectId: "fit-app-io"
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
firebase.firestore();



// Create store with reducers and initial state
const initialState = {};
export const store = createStore(
  rootReducer, 
  initialState,
  applyMiddleware(thunk, logger)
);

// Firebase utils
export const fire = firebase;
export const firebaseAuth = firebase.auth();
export const database = firebase.firestore();