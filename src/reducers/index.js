import {combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { loading } from '../reducers/loading';
import { user } from '../reducers/user';
import { menu } from '../reducers/menu';

// Add Firebase to reducers
const rootReducer = combineReducers({
  firestore: firestoreReducer, 
  user, 
  loading, 
  menu
});

export default rootReducer;
