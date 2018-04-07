import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import Nav from '../templates/blocks/Nav';
import UserLog from '../templates/blocks/UserLog';

import users from '../data/users.json';
import exercises from '../data/exercises.json';

import FontAwesome from './fontawesome-all.min.js';

test('has 5 menu entries', () => {
  const menuProps = {
    status: 'closed',
    workouts: 'closed',
    layout: 'default'
  };
  const routineProps = {
    routines: users[0].routines
  };
  const exercisesProps = {
    list: exercises
  };
  const dash = shallow(
    <Nav
      menu={menuProps}
      routines={routineProps}
      exercises={exercisesProps}
      toggleModal={() => {
        return true;
      }}
    />
  );

  // Expecting to find 5 menu entries
  expect(dash.find('.nav li')).toHaveLength(5);
});

test('shows the user name', () => {
  const mockuser = users[0];

  const userItem = shallow(<UserLog user={mockuser} />);

  expect(userItem.find('p').text()).toEqual('Hello, Benoit');
});

test('shows a profile pic even if none is provided', () => {
  const mockuser1 = users[0];
  const mockuser2 = users[1];

  const imageItem = shallow(<UserLog user={mockuser1} />);

  const defaultItem = shallow(<UserLog user={mockuser2} />);

  expect(imageItem.find('.profile').prop('data-image')).toEqual('true');
  expect(defaultItem.find('.profile').prop('data-image')).toEqual('true');
});
