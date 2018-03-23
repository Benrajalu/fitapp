import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import RoutineMaker from '../templates/blocks/RoutineMaker';
import PropTypes from 'prop-types';

import users from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import FontAwesome from './fontawesome-all.min.js';

function handleFormPost() {
  console.log('coucou');
}
const user = users[0],
  exercises = exercisesDatabase,
  menuState = { status: 'closed', workouts: 'closed', layout: 'hidden' },
  toggleMenu = function() {
    console.log('coucou');
  },
  watchRoutines = function() {
    console.log('coucou');
  };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <RoutineMaker
        postHandler={handleFormPost}
        user={user}
        exercises={exercises}
        menuState={menuState}
        toggleMenu={toggleMenu}
        watchRoutines={watchRoutines}
      />
    </MemoryRouter>,
    div
  );
});

test("can't submit when it's empty", () => {
  const maker = mount(
    <MemoryRouter>
      <RoutineMaker
        postHandler={handleFormPost}
        user={user}
        exercises={exercises}
        menuState={menuState}
        toggleMenu={toggleMenu}
        watchRoutines={watchRoutines}
      />
    </MemoryRouter>
  );

  // Expecting message not to be empty
  expect(maker.find('.btn.important').props().disabled).toBeTruthy();
});

test('runs the required user tasks smoothy until submit', () => {
  const MountOptions = {
    context: {
      router: {
        history: {
          createHref: (a, b) => {},
          push: () => {},
          replace: () => {},
          block: () => {}
        }
      }
    },
    childContextTypes: {
      router: PropTypes.object
    }
  };

  const maker = mount(
    <RoutineMaker
      postHandler={handleFormPost}
      user={user}
      exercises={exercises}
      menuState={menuState}
      toggleMenu={toggleMenu}
      watchRoutines={watchRoutines}
    />,
    MountOptions
  );

  maker.setState({
    exercisesDatabase: exercisesDatabase,
    newRoutine: {
      name: 'Routine B',
      id: '02routineB',
      color: '#DE762E',
      exercises: [
        {
          exerciseId: 'ex-04',
          sets: '5',
          reps: '10',
          handicap: '20'
        },
        {
          exerciseId: 'ex-06',
          sets: '8',
          reps: '5',
          handicap: '15'
        }
      ]
    },
    errors: {}
  });

  // Testing that buttons to up / down the exercises work
  expect(
    maker
      .find('.exercise-tuner .title')
      .first()
      .text()
  ).toEqual('Bent-over Rows');
  maker
    .find('.exercise-tuner .btn-down')
    .first()
    .simulate('click');
  expect(
    maker
      .find('.exercise-tuner .title')
      .first()
      .text()
  ).toEqual('Triceps press-down');

  // Expecting message not to be empty
  expect(maker.find('.help-block')).toHaveLength(0);
});
