import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import BarbellLoader from '../templates/blocks/BarbellLoader';

import userData from '../data/users.json';

it('renders without crashing', () => {
  const loader = shallow(
    <BarbellLoader settings={userData[0].settings} weight={10} />
  );
});

describe('given set discs and target weights', () => {
  let settings = {
    baseBarbell: 10,
    availableWeights: [10]
  };

  const loaderEmpty = mount(<BarbellLoader settings={settings} weight={10} />);
  test('it displays no disc when none are needed', () => {
    expect(loaderEmpty.find('.disc').length).toEqual(0);
  });

  const loaderThirty = mount(<BarbellLoader settings={settings} weight={30} />);
  test('it displays the right disc for one side of the barbell', () => {
    expect(loaderThirty.find('.disc').length).toEqual(1);
    expect(loaderThirty.find('.size-10').length).toEqual(1);
  });

  const loaderThirtyFive = mount(
    <BarbellLoader settings={settings} weight={35} />
  );
  test('it displays a message when available weights do not reach requested total', () => {
    expect(loaderThirtyFive.find('.disc').length).toEqual(1);
    expect(loaderThirtyFive.find('.size-10').length).toEqual(1);
    expect(loaderThirtyFive.find('.alert strong').text()).toEqual(' -5kg');
  });

  settings = {
    baseBarbell: 10,
    availableWeights: [10, 5]
  };

  const loaderFourty = mount(<BarbellLoader settings={settings} weight={40} />);
  test('it displays smaller discs first', () => {
    expect(
      loaderFourty
        .find('.disc')
        .first()
        .text()
    ).toEqual('5 kg');
    expect(
      loaderFourty
        .find('.disc')
        .at(1)
        .text()
    ).toEqual('10 kg');
  });
});
