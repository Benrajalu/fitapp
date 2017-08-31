import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import AllRoutines from '../pages/AllRoutines';

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
  expect(dash.find('p').text()).not.toHaveLength(0);
});