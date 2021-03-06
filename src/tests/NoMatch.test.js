import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import NoMatch from '../templates/pages/NoMatch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <NoMatch />
    </MemoryRouter>,
    div
  );
});

test('displays the test message', () => {
  const dash = shallow(<NoMatch />);

  // Expecting message not to be empty
  expect(dash.find('h1').text()).not.toHaveLength(0);
});
