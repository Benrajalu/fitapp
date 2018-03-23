import {database} from '../store/';

// Login actions
export const getAllExercises = (database) => ({
    type: 'GET_EXERCISES_DATABASE', 
    list: database
});

export function watchExercises() {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    database.collection('exercises').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
            data.id = doc.id;
        output.push(data);
      });
      dispatch(getAllExercises(output));
    });
  }
}