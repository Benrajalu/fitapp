import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount, dive } from 'enzyme';
import { fakeStore } from '../store/index';

import AllRoutines from '../templates/pages/AllRoutines';
import Routines from '../templates/blocks/Routines';
import PropTypes from 'prop-types';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import FontAwesome from './fontawesome-all.min.js';

jest.useFakeTimers();

it('shows the provided routines', () => {
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
  const dash = mount(<AllRoutines store={fakeStore} />, MountOptions);

  expect(
    dash
      .find('.title')
      .at(0)
      .text()
  ).toEqual('Routine A');
});

test("displays all the user's routines", () => {
  const routinesList = userData[0].routines;
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
  const listing = mount(
    <Routines
      list={routinesList}
      exercisesDatabase={exercisesDatabase}
      user={userData[0]}
    />,
    MountOptions
  );

  expect(listing.find('.routine-detail').length).not.toEqual(0);
});
