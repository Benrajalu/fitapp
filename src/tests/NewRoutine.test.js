import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import NewRoutine from '../templates/pages/NewRoutine';
import { fakeStore } from '../store/index';

import FontAwesome from './fontawesome-all.min.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <NewRoutine store={fakeStore} />
    </MemoryRouter>,
    div
  );
});

test('displays the test message', () => {
  const dash = mount(
    <MemoryRouter>
      <NewRoutine store={fakeStore} />
    </MemoryRouter>
  );

  // Expecting message not to be empty
  expect(dash.find('.page-header').text()).not.toHaveLength(0);
});
