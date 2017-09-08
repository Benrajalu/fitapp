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
        exercises={updateExercises}
        settings={users[0]} />
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
        exercises={updateExercises}
        settings={users[0]} />
  );

  picker.find('.exercise').first().simulate('click');

  expect(picker.find('.exercise-pick')).not.toHaveLength(0);
});

