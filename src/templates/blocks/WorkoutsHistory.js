import React, { Component } from 'react';
import WorkoutHistoryDetail from '../blocks/WorkoutHistoryDetail';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import moment from 'moment';
import 'moment/locale/fr';

class WorkoutsHistory extends Component {
  render() {
    // Order the workouts chronologically
    let workoutItems = [];

    const workouts = this.props.workoutLogs.sort((a, b) => {
      var c = a.timestamp;
      var d = b.timestamp;
      return c > d ? -1 : c < d ? 1 : 0;
    });

    // Output items according to limits on component
    if (this.props.limit === 'week') {
      let now = moment().valueOf();
      workoutItems = workouts.filter(obj => {
        let timeOfWorkout = moment(obj.timestamp).valueOf();
        let startOfWeek = moment(now)
          .startOf('week')
          .valueOf();
        return moment(timeOfWorkout).isAfter(startOfWeek);
      });
    } else {
      workoutItems = workouts;
    }

    const output = workoutItems.map((value, index) => (
      <WorkoutHistoryDetail
        key={value.id}
        contents={value}
        exercisesDatabase={this.props.exercisesDatabase}
        delay={index * 100}
      />
    ));

    return (
      <div className="workout-logs-list">
        {workoutItems.length > 0 ? (
          output
        ) : (
          <div className="empty-workouts">
            <p>Aucun entraînement cette semaine</p>
            <button className="btn btn-ghost">
              <FontAwesomeIcon icon={['fas', 'play']} size="1x" /> Lancer une
              scéance
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default WorkoutsHistory;
