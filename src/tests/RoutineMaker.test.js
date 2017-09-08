import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import RoutineMaker from '../blocks/RoutineMaker';

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

test('displays no messages when it submits filled', () => {
  const maker = mount(
    <RoutineMaker />
  );

  const timestamp = new Date();

  maker.setState({
    newRoutine: {
      name: "Routine B",
      id: "02routineB", 
      color: "#DE762E", 
      exercises: [
        {
          "exerciceId": "ex-04", 
          "sets": "5", 
          "reps": "10",
          "handicap": "20"
        },
        {
          "exerciceId": "ex-06", 
          "sets": "8", 
          "reps": "5",
          "handicap": "15"
        }
      ]
    },
    errors:{}
  })

  maker.find('form').simulate('submit');
  
  // Expecting message not to be empty
  expect(maker.find('.help-block')).toHaveLength(0);
});