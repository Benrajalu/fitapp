import React from 'react';

import moment from 'moment';
import 'moment/locale/fr';

const Intro = ({ user }) => {
  moment.locale('fr');
  return (
    <div className="dashboard-intro">
      <h1>
        Hello, <br />
        {user.displayName}
      </h1>
      <p className="currentDate">{moment().format('dddd DD MMMM YYYY')}</p>
    </div>
  );
};

export default Intro;
