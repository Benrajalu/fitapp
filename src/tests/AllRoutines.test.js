import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import AllRoutines from '../pages/AllRoutines';
import Routines from '../blocks/Routines';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <AllRoutines />
    </MemoryRouter>, 
  div);
});

test('displays the test message', () => {
  const dash = shallow(
    <AllRoutines />
  );
  
  // Expecting message not to be empty
  expect(dash.find('h1').text()).not.toHaveLength(0);
});

test('displays user routines', () => {
  const routinesList = userData[0].routines;

  const listing = mount(
    <MemoryRouter>
      <Routines list={routinesList} exercisesDatabase={exercisesDatabase} />
    </MemoryRouter>
  );

  expect(listing.find('.routine-card').length).not.toEqual(0)
});