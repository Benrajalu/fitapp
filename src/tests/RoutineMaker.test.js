import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import RoutineMaker from '../blocks/RoutineMaker';

import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <RoutineMaker />
    </MemoryRouter>, 
  div);
});

test('displays error messages when it submits empty', () => {
  const maker = mount(
    <RoutineMaker />
  );

  maker.find('form').simulate('submit');
  
  // Expecting message not to be empty
  expect(maker.find('.help-block')).toHaveLength(2);
});

test('runs the required user tasks smoothy until submit', () => {
  const maker = mount(
    <RoutineMaker />
  );

  const timestamp = new Date();

  maker.setState({
    exercisesDatabase: exercisesDatabase,
    newRoutine: {
      name: "Routine B",
      id: "02routineB", 
      color: "#DE762E", 
      exercises: [
        {
          "exerciseId": "ex-04", 
          "sets": "5", 
          "reps": "10",
          "handicap": "20"
        },
        {
          "exerciseId": "ex-06", 
          "sets": "8", 
          "reps": "5",
          "handicap": "15"
        }
      ]
    },
    errors:{}
  })

  // Testing that buttons to up / down the exercises work 
  expect(maker.find('.panel-heading h3').first().text()).toEqual('Bent-over Rows');
  maker.find('.panel-heading .btn-down').first().simulate('click');
  expect(maker.find('.panel-heading h3').first().text()).toEqual('Triceps press-down');
  
  // Expecting message not to be empty
  expect(maker.find('.help-block')).toHaveLength(0);
});