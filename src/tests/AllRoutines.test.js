import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import AllRoutines from '../pages/AllRoutines';
import Routines from '../blocks/Routines';
import PropTypes from 'prop-types';

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
  const MountOptions = {
      context: {
        router: {
          history: {
            createHref: (a, b) => {
            },
            push: () => {
            },
            replace: () => {
            }, 
            block: ()=> {
            }
          }
        }
      }, childContextTypes: {
        router: PropTypes.object
      }
  };
  const listing = mount(
    <Routines list={routinesList} exercisesDatabase={exercisesDatabase} user={userData[0]}/>, 
    MountOptions
  );

  expect(listing.find('.routine-detail').length).not.toEqual(0)
});