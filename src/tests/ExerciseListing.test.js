import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';

import ExerciseListing from '../blocks/ExerciseListing';
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
  expect(exoWeight.find('p').first().text()).toEqual('10 x 20kg');
  expect(exoMinutes.find('p').first().text()).toEqual('1 x 40minutes');
});