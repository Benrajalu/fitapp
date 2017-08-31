import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Settings from '../pages/Settings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>, 
  div);
});

test('displays the test message', () => {
  const dash = shallow(
    <Settings />
  );
  
  // Expecting message not to be empty
  expect(dash.find('p').text()).not.toHaveLength(0);
});