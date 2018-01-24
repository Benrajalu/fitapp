import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Nav from '../blocks/Nav';
import UserLog from '../blocks/UserLog';

import users from '../data/users.json';

import FontAwesome from './fontawesome-all.min.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Nav />
    </MemoryRouter>, 
  div);
});

test('has 4 menu entries', () => {
  const dash = shallow(
    <Nav />
  );
  
  // Expecting to find 5 menu entries
  expect(dash.find('.nav li')).toHaveLength(4);
});

test('shows the user name', () => {
  const mockuser = users[0];

  const userItem = shallow(
    <UserLog user={mockuser} />
  );

  expect(userItem.find('p').text()).toEqual('Hello, Benoit');
});

test('shows a profile pic even if none is provided', () => {
  const mockuser1 = users[0];
  const mockuser2 = users[1];

  const imageItem = shallow(
    <UserLog user={mockuser1} />
  );

  const defaultItem = shallow(
    <UserLog user={mockuser2} />
  );

  expect(imageItem.find('.profile').prop('data-image')).toEqual("true");
  expect(defaultItem.find('.profile').prop('data-image')).toEqual("true");
});