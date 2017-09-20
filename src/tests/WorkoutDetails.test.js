import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import WorkoutDetails from '../blocks/WorkoutDetails';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const updateRoutine = function(index, event){
    return true
  };

  const feedReps = function(data, index){
   return true
  };

  const value = {
    "exerciceId": "ex-04", 
    "sets": "5", 
    "reps": "10",
    "handicap": "20"
  }

  const dash = shallow(
    <WorkoutDetails contents={value} exercisesDatabase={exercisesDatabase} index={0} onUpdate={updateRoutine} onReps={feedReps} settings={userData[0].settings}/>
  );
});

it('accurately translate completed sets and reps arrays into values', () => {
  const updateRoutine = function(index, event){
    return true
  };

  const feedReps = function(data, index){
   return true
  };

  const value = {
    "exerciceId": "ex-04", 
    "sets": "5", 
    "reps": "10",
    "handicap": "20"
  }

  const dash = mount(
    <WorkoutDetails contents={value} exercisesDatabase={exercisesDatabase} index={0} onUpdate={updateRoutine} onReps={feedReps} settings={userData[0].settings}/>
  );

  dash.setState({
    completedSets: [1, 0, 0, 0, 0],
    sets: [10, 0, 0, 0, 0]
  });

  expect(dash.find('.panel-title').first().text()).toEqual('Bent-over Rows 1/5');
  expect(dash.find('.set-counter .panel-title').first().text()).toEqual('Set 1 | 10/10 reps');
});

it('manages to deal with cardio exercises by remplacing reps with minutes', () => {
  const updateRoutine = function(index, event){
    return true
  };

  const feedReps = function(data, index){
   return true
  };

  const value = {
    "exerciceId": "ex-30",  
    "handicap": "40"
  }

  const dash = mount(
    <WorkoutDetails contents={value} exercisesDatabase={exercisesDatabase} index={0} onUpdate={updateRoutine} onReps={feedReps} settings={userData[0].settings}/>
  );

  expect(dash.find('.set-counter .panel-title').first().text()).toEqual('Set 1 | 0/40 minutes');
});