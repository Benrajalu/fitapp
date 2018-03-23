import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow} from 'enzyme';
import Dashboard from '../templates/pages/Dashboard';

test('displays the test message', () => {
  const dash = shallow(
    <Dashboard />
  );
  
  // Expecting at least a logo
  expect(dash.find('.mainLogo').text()).not.toHaveLength(0);
});