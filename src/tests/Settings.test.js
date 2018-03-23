import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { fakeStore } from '../store/index';
import PropTypes from 'prop-types';
import Settings from '../templates/pages/Settings';

import userData from '../data/users.json';
import FontAwesome from './fontawesome-all.min.js';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Settings store={fakeStore} />
    </MemoryRouter>,
    div
  );
});

test('displays the test message', () => {
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
  const dash = mount(<Settings store={fakeStore} />, MountOptions);

  // Expecting message not to be empty
  expect(dash.find('h1').text()).not.toHaveLength(0);
});

describe('when managing settings', () => {
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
  const settings = mount(<Settings store={fakeStore} />, MountOptions);

  settings.setState({
    loading: false,
    userId: '01',
    settings: userData[0].settings,
    userName: userData[0]['displayName'],
    userPic: userData[0]['profilePicture'],
    userEmail: userData[0]['contactEmail']
  });

  test("it displays the user's current settings", () => {
    expect(settings.find('input#barbellWeight').props().value).toEqual(10);
    expect(
      settings
        .find('input[type="checkbox"]')
        .first()
        .props().checked
    ).not.toBeTruthy();
  });
});
