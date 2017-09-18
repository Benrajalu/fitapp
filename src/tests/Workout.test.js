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

  dash.setState({
    routineId: '01routineA', 
    user: userData[0],
    exercisesDatabase: exercisesDatabase, 
    routine: userData[0].routines.filter(obj => obj.id === '01routineA' )[0],
    changedRoutine: false, 
    workoutLog: {}
  })
  
  // Expecting message not to be empty
  expect(dash.find('h1 small').text()).toEqual('Routine A');
});