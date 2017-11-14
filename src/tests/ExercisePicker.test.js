import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import ExercisePicker from '../blocks/ExercisePicker';

import users from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  
  let modalDisplay = false;

  const displayModal = function(event) {
    modalDisplay: !modalDisplay
  }

  const updateExercises = function(data) {
    return true;
  }

  ReactDOM.render(
    <MemoryRouter>
      <ExercisePicker 
        exercisesDatabase={exercisesDatabase} 
        shouldAppear={modalDisplay ? 'visible' : 'hidden'} 
        modalCloser={displayModal}
        updateExercises={updateExercises}
        settings={users[0]}
        pickedExercises={[]} />
    </MemoryRouter>, 
  div);
});

it('add exercises when users click on one', () => {
  const div = document.createElement('div');
  
  let modalDisplay = false;

  const displayModal = function(event) {
    modalDisplay: !modalDisplay
  }

  const updateExercises = function(data) {
    return true;
  }

  const picker = mount(
      <ExercisePicker 
        exercisesDatabase={exercisesDatabase} 
        shouldAppear={modalDisplay ? 'visible' : 'hidden'} 
        modalCloser={displayModal}
        updateExercises={updateExercises}
        settings={users[0]}
        pickedExercises={[]} />
  );

  picker.find('.exercise-action').first().simulate('click');

  expect(picker.find('.exercise-pick')).not.toHaveLength(0);
});

it('add displays current exercises when users edit a routine', () => {
  let modalDisplay = false;
  const displayModal = function(event) {
    modalDisplay: !modalDisplay
  }
  const updateExercises = function(data) {
    return true;
  }

  const testExercises=[{exerciseId: "ex-04", sets: "5", reps: "10", handicap: "20"},{exerciseId: "ex-06", sets: "8", reps: "5", handicap: "15"}];

  const picker = mount(
      <ExercisePicker 
        exercisesDatabase={exercisesDatabase} 
        shouldAppear={modalDisplay ? 'visible' : 'hidden'} 
        modalCloser={displayModal}
        updateExercises={updateExercises}
        settings={users[0]}
        pickedExercises={testExercises} />
  );
  expect(picker.find('.exercise-pick').first().text()).toEqual("Bent-over Rows ");
});

