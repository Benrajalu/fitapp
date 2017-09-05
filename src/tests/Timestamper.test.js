import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import Timestamper from '../blocks/Timestamper';

const testTimestamp = 1504290660, 
      todayStamp = + new Date();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Timestamper timestamp={testTimestamp * 1000} />
    </MemoryRouter>, 
  div);
});

test('figures out if the date is today', () => {
  const stamp = shallow(
    <Timestamper timestamp={todayStamp} />
  );
  
  // Expecting message not to be empty
  expect(stamp.find('p').text().split(' ')[0]).toEqual("Aujourd'hui");
});