import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Workout from '../pages/Workout';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const dash = shallow(
    <Workout />
  );

  dash.setState({
    routineId: '01routineA', 
    user: userData[0],
    exercisesDatabase: exercisesDatabase, 
    routine: userData[0].routines.filter(obj => obj.id === '01routineA' )[0]
  })
});

test('displays the correct routine', () => {
  const dash = shallow(
    <Workout />
  );

  const today = new Date(), 
        cleanRoutine = userData[0].routines.filter(obj => obj.id === "01routineA" )[0];
  
  // Setting up a mock version of the workout log (for history) of the current exercises...
  let logExercises = [];
  // ...then mapping the routine's infos into it
  cleanRoutine.exercises.map((value) => 
    logExercises.push({
      exerciseId: value.exerciseId, 
      repTarget: value.reps ? value.reps : false,
      setsTarget: value.sets ? value.sets : false,
      handicap: value.handicap ? value.handicap : 0
    })
  );

  dash.setState({
    user: userData[0],
    exercisesDatabase: exercisesDatabase, 
    routine: cleanRoutine, 
    workoutLog:{
      "id": "log-" + today.getTime(), 
      "routineName": userData[0].routines.filter(obj => obj.id === "01routineA" )[0].name, 
      "timestamp": today.getTime(), 
      "exercises": logExercises
    }
  });
  
  // Expecting message not to be empty
  expect(dash.find('h1 small').text()).toEqual('Routine A');
});