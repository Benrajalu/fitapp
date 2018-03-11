import React, { Component } from 'react';
import WorkoutHistoryDetail from '../blocks/WorkoutHistoryDetail';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import moment from 'moment';
import 'moment/locale/fr';

class WorkoutsHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: 0,
      activePage: 1,
      totalPages: 0
    };
  }

  changePage(value, event) {
    event.preventDefault();
    let newValue;
    // According to direction parameter, we assess if we go forward or back
    switch (value) {
      case 'less':
        // Going back is only possible if you're not going lower than 0, of course
        newValue =
          this.state.pagination - 5 > 0 ? this.state.pagination - 5 : 0;
        break;

      case 'more':
        // You can't go forward more than the total of items, so if 5 more is overboard you're staying where you've reached
        newValue =
          this.state.pagination + 5 < this.props.workoutLogs.length
            ? this.state.pagination + 5
            : this.state.pagination;
        break;

      default:
        return false;
    }

    // Figuring out what page we're in by comparing the new value to a multiplier of a loop going for a total divided by 5
    for (let i = 0; i < Math.ceil(this.props.workoutLogs.length / 5); i++) {
      if (newValue === i * 5) {
        this.setState({
          activePage: i + 1
        });
      }
    }

    this.setState({
      pagination: newValue
    });
    document
      .getElementsByClassName('workout-logs')[0]
      .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  componentDidMount() {
    const pageNumber = Math.ceil(this.props.workoutLogs.length / 5);
    this.setState({
      totalPages: pageNumber
    });
  }

  componentWillReceiveProps(nextProps) {
    const pageNumber = Math.ceil(nextProps.workoutLogs.length / 5);
    this.setState({
      totalPages: pageNumber
    });
  }

  render() {
    // Order the workouts chronologically
    let workoutItems = [],
      pages = null;

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
      pages = true;
      workoutItems = workouts.slice(
        this.state.pagination,
        this.state.pagination + 5
      );
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
          <div id="listWrapper">
            {output}
            {pages ? (
              <ul className="pagination">
                <li className="legend">
                  Page {this.state.activePage} / {this.state.totalPages}
                </li>
                <li>
                  <button
                    onClick={this.changePage.bind(this, 'less')}
                    title="précédent">
                    <FontAwesomeIcon icon={['far', 'angle-left']} size="1x" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={this.changePage.bind(this, 'more')}
                    title="suivant">
                    <FontAwesomeIcon icon={['far', 'angle-right']} size="1x" />
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="empty-workouts">
            <p>Aucun entraînement cette semaine</p>
            <button
              className="btn btn-ghost"
              onClick={this.props.triggerWorkoutWindow.bind(this)}>
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
