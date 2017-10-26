import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import {shallow, mount} from 'enzyme';
import Settings from '../pages/Settings';

import userData from '../data/users.json';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>, 
  div);
});

test('displays the test message', () => {
  const dash = mount(
    <Settings />
  );
  
  // Expecting message not to be empty
  expect(dash.find('h1').text()).not.toHaveLength(0);
});

describe('when managing settings', () => {
  const settings = mount(
    <Settings />
  );  

  settings.setState({
    loading: false,
    userId:"01",
    settings: userData[0].settings,
    userName : userData[0]["displayName"],
    userPic: userData[0]["profilePicture"],
    userEmail: userData[0]["contactEmail"]
  });

  test("it displays the user's current settings", () => {
    expect(settings.find('input[type="number"]').props().value).toEqual(10);
    expect(settings.find('input[type="checkbox"]').first().props().checked).not.toBeTruthy();
  });

  test("it updates settings flawlessly", () => {
    // Checking the first disc weight, making it available
    let settingsTest={baseBarbell: 10, availableWeights:[25]};
    settings.setState({
      settings: settingsTest,
    });
    expect(settings.find('input[type="checkbox"]').first().props().checked).toBeTruthy();
    // Unchecking it
    settingsTest={baseBarbell: 10, availableWeights:[20]};
    settings.setState({
      settings: settingsTest,
    });
    expect(settings.find('input[type="checkbox"]').first().props().checked).not.toBeTruthy();
  });

  test("it won't move if you try to feed it a bad email", () => {
    settings.setState({
      userEmail: "bad email"
    });
    settings.find('input[name="userEmail"]').simulate('change');
    expect(settings.find('button[type="submit"]').props().disabled).toBeTruthy();
    // Unchecking it
    settings.setState({
      userEmail: "test@test.com"
    });
    settings.find('input[name="userEmail"]').simulate('change');
    expect(settings.find('button[type="submit"]').props().disabled).not.toBeTruthy();
  });
  
});