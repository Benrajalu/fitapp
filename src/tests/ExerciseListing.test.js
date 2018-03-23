import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';

import ExerciseListing from '../templates/blocks/ExerciseListing';
import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';


it('distinguishes bewteen weights and minutes', () => {
  const rowsByTen = userData[0].routines[0].exercises[0];
  const cardio = userData[0].routines[0].exercises[2];
  const exoWeight = mount(
    <ExerciseListing  exerciseData={rowsByTen} exercisesDatabase={exercisesDatabase} />
  );
  const exoMinutes = mount(
    <ExerciseListing  exerciseData={cardio} exercisesDatabase={exercisesDatabase} />
  );
  expect(exoWeight.find('p.reps').first().text()).toEqual('10 reps');
  expect(exoWeight.find('p.handicap').first().text()).toEqual(' 20 kg');
  expect(exoMinutes.find('p.sets').first().text()).toEqual('01 set');
  expect(exoMinutes.find('p.handicap').first().text()).toEqual(' 40 min');
});