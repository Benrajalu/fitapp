import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import WeekCounter from '../templates/blocks/WeeklyCounter';

import userData from '../data/users.json';

const testTimestamp = 1504290660, 
      todayStamp = + new Date(), 
      fakeWorkouts = {
        list: userData[0].workoutLog
      },
      fakeRoutines = {
        list : [
          {
            timestamp: todayStamp
          }
        ]
      };

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <WeekCounter workoutLogs={fakeWorkouts} />
    </MemoryRouter>, 
  div);
});

test('logs "1" if there has been one workout done in the past 7 days', () => {
  const count = shallow(
    <WeekCounter workoutLogs={fakeRoutines} />
  );
  
  // Expecting message not to be empty
  expect(count.find('strong').text()).toEqual("1");
});