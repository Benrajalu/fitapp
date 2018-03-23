import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import History from '../templates/pages/History';
import { fakeStore } from '../store/index';

import FontAwesome from './fontawesome-all.min.js';

test('displays the test message', () => {
  const dash = shallow(<History store={fakeStore} />);

  // Expecting message not to be empty
  expect(dash.find('h1').text()).not.toHaveLength(0);
});
