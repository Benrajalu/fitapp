import React, { Component, Fragment } from 'react';

import moment from "moment";
import 'moment/locale/fr';

class Intro extends Component {
  render() {
    let now = moment().valueOf();
    let weeklyLogs = this.props.workoutLogs.list.filter((obj) => {
      let timeOfWorkout = moment(obj.timestamp).valueOf();
      let startOfWeek = moment(now).startOf('week').valueOf();
      return moment(timeOfWorkout).isAfter(startOfWeek);
    });
    return(
      <Fragment>
      {weeklyLogs.length > 0 ?
        <p className="weeklyLog">Déjà <strong>{weeklyLogs.length}</strong> séance{weeklyLogs.length > 1 ? "s" : null} cette semaine !</p>
        :
        <p className="weeklyLog">Aucun entrainement cette semaine...</p>
      }
      </Fragment>
    )
  }
};

export default Intro;