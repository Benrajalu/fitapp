import { combineReducers } from "redux";
//import { firestoreReducer } from 'redux-firestore';
import { loading } from "../reducers/loading";
import { exercises } from "../reducers/exercises";
import { user } from "../reducers/user";
import { menu } from "../reducers/menu";
import { modals } from "../reducers/modals";
import { routines } from "../reducers/routines";
import { workoutLogs } from "../reducers/workoutLogs";

// Add Firebase to reducers
const rootReducer = combineReducers({
  user,
  exercises,
  loading,
  menu,
  modals,
  routines,
  workoutLogs
});

export default rootReducer;
