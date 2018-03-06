import { createStore, applyMiddleware } from 'redux'; // Use compose if need firebase again
//import { reduxFirestore } from 'redux-firestore'
import firebase from 'firebase';
import 'firebase/firestore';

import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import userData from '../data/users.json';

const config = {
  apiKey: 'AIzaSyCk5jCqyW5yNP32nTn5yha6PEi2wSFuCKg',
  authDomain: 'fit-app-io.firebaseapp.com',
  projectId: 'fit-app-io'
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
firebase.firestore();

// Create store with reducers and initial state
const initialState = {};
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk)
);

// Add logger to middlewere if needed

// Test store for, well, tests
const fakeInitialState = {
  routines: {
    routines: userData[0].routines
  }
};
export const fakeStore = createStore(
  rootReducer,
  fakeInitialState,
  applyMiddleware(thunk)
);

// Firebase utils
export const fire = firebase;
export const firebaseAuth = firebase.auth();
export const database = firebase.firestore();
