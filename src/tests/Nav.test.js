import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Nav from '../blocks/Nav';
import UserLog from '../blocks/UserLog';

import users from '../data/users.json';

describe('The Nav component', () => {
  beforeAll(() => {
    const ls = require("../utils/localStorageMock.js");
    ls.setLocalStorage();
  });

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

  test('shows the user name', () => {
    const mockuser = users[0];

    const userItem = shallow(
      <UserLog user={mockuser} />
    );

    expect(userItem.find('p').text()).toEqual('Hello, Benoit');
  });

  test('shows absolute profile pic or default avatar', () => {
    const mockuser1 = users[0];
    const mockuser2 = users[1];

    const imageItem = shallow(
      <UserLog user={mockuser1} />
    );

    const defaultItem = shallow(
      <UserLog user={mockuser2} />
    );

    expect(imageItem.find('img').prop('src').split(':')[0]).toMatch(new RegExp('http'));
    expect(defaultItem.find('img').prop('src')).toMatch(new RegExp('default-avatar.png'));
  });
})