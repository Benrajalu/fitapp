import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { fakeStore } from '../store/index';
import Workout from '../templates/pages/Workout';
import PropTypes from 'prop-types';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';
import FontAwesome from './fontawesome-all.min.js';

it('renders without crashing', () => {
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
  const match = {
    params: {
      id: '01routineA'
    }
  };
  const dash = mount(<Workout match={match} store={fakeStore} />, MountOptions);

  /*dash.setState({
    routineId: '01routineA',
    user: {
      contactEmail: userData[0].contactEmail,
      displayName: userData[0].displayName,
      profilePicture: userData[0].profilePicture,
      signinEmail: userData[0].signinEmail,
      uid: '0',
      settings: {
        availableWeights: [20, 10, 5, 2.5, 1.25, 0.5, 0.25],
        baseBarbell: 10
      }
    },
    exercisesDatabase: exercisesDatabase,
    routine: userData[0].routines.filter(obj => obj.id === '01routineA')[0],
    workoutLog: {
      exercises: [
        {
          exerciseId: 'ex-11',
          handicap: 10,
          repTarget: 1,
          sets: [0],
          setsTarget: 1
        }
      ]
    }
  });*/
});
