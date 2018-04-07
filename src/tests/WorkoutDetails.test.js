import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import WorkoutExerciseFull from '../templates/blocks/WorkoutBlocks/WorkoutExerciseFull';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import FontAwesome from './fontawesome-all.min.js';

const updateRoutine = function(index, event) {
  return true;
};

const feedReps = function(data, index) {
  return true;
};

const toggleModal = function(data, event) {
  return true;
};

it('renders without crashing', () => {
  const value = {
    exerciseId: 'ex-04',
    sets: '5',
    reps: '10',
    handicap: '20'
  };

  const dash = shallow(
    <WorkoutExerciseFull
      contents={value}
      exercisesDatabase={exercisesDatabase}
      index={0}
      onUpdate={updateRoutine}
      onReps={feedReps}
      settings={userData[0].settings}
      showExercise={function() {
        console.log('exercise switch');
      }}
      toggleModal={toggleModal}
      last={false}
    />
  );
});

it('accurately translate completed sets and reps arrays into values', () => {
  const value = {
    exerciseId: 'ex-04',
    sets: [0, 0, 0, 0, 0],
    repTarget: '10',
    setsTarget: '5',
    handicap: '20'
  };

  const dash = mount(
    <WorkoutExerciseFull
      contents={value}
      exercisesDatabase={exercisesDatabase}
      index={0}
      onUpdate={updateRoutine}
      onReps={feedReps}
      settings={userData[0].settings}
      showExercise={function() {
        console.log('exercise switch');
      }}
      toggleModal={toggleModal}
      last={false}
    />
  );

  const newValue = {
    exerciseId: 'ex-04',
    sets: [10, 0, 0, 0, 0],
    repTarget: '10',
    setsTarget: '5',
    handicap: '20'
  };

  dash.setProps({
    contents: newValue
  });

  expect(
    dash
      .find('.completion-small p')
      .first()
      .text()
  ).toEqual('1/5');
  expect(
    dash
      .find('.set-counter .count')
      .first()
      .text()
  ).toEqual('10/10reps');
});

it('manages to deal with cardio exercises by remplacing reps with minutes', () => {
  const value = {
    exerciseId: 'ex-30',
    handicap: '40'
  };

  const dash = mount(
    <WorkoutExerciseFull
      contents={value}
      exercisesDatabase={exercisesDatabase}
      index={0}
      onUpdate={updateRoutine}
      onReps={feedReps}
      settings={userData[0].settings}
      showExercise={function() {
        console.log('exercise switch');
      }}
      toggleModal={toggleModal}
      last={false}
    />
  );

  expect(
    dash
      .find('.set-counter .count')
      .first()
      .text()
  ).toEqual('0/40minutes');
});
