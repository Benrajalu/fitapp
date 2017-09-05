import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import WeekCounter from '../blocks/WeekCounter';

import userData from '../data/users.json';

const testTimestamp = 1504290660, 
      todayStamp = + new Date(), 
      fakeRoutines = [
        {
          "timestamp": todayStamp / 1000
        }
      ];

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <WeekCounter list={userData[0].routines} />
    </MemoryRouter>, 
  div);
});

test('logs "1" if there has been one workout done in the past 7 days', () => {
  const count = shallow(
    <WeekCounter list={fakeRoutines} />
  );
  
  // Expecting message not to be empty
  expect(count.find('.badge').text()).toEqual("1");
});