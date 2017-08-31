import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Nav from '../blocks/Nav';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>, 
  div);
});

test('has 5 menu entries', () => {
  const dash = shallow(
    <Nav />
  );
  
  // Expecting to find 5 menu entries
  expect(dash.find('li')).toHaveLength(5);
});