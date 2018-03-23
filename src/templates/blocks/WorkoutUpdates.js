import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class WorkoutUpdates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.willUpgrade ? 'yes' : 'no'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isChecked: nextProps.willUpgrade ? 'yes' : 'no'
    });
  }
  render() {
    const currentExercise = this.props.allSets[this.props.completedSet],
      fullData = this.props.database.filter(
        obj => obj.id === currentExercise.exerciseId
      )[0];

    let update = 0,
      unit = 'kg';

    if (fullData.type === 'cardio') {
      unit = 'minutes';
      update = 10;
    } else if (
      fullData.type === 'barbell' ||
      fullData.type === 'calisthenics'
    ) {
      update = 5;
    } else {
      update = 2;
    }

    return (
      <div className="workout-update">
        <div
          className="description"
          onClick={this.props.toggleUpdate.bind(this, this.props.completedSet)}>
          <h4 className="title">{fullData.name}</h4>
          <p>
            Passer de{' '}
            <strong>
              {currentExercise.handicap}
              {unit}
            </strong>{' '}
            à{' '}
            <strong>
              {parseFloat(currentExercise.handicap) + update}
              {unit}
            </strong>
          </p>
        </div>
        <div className="input">
          <input
            type="checkbox"
            id={fullData.name.replace(' ', '') + '-' + this.props.index}
            className="checkbox"
            checked={this.state.isChecked === 'yes' ? true : false}
            value={this.state.isChecked}
            name="exercise update"
          />
          <label
            onClick={this.props.toggleUpdate.bind(
              this,
              this.props.completedSet
            )}>
            <FontAwesomeIcon icon={['fal', 'check']} size="1x" />
          </label>
        </div>
      </div>
    );
  }
}

WorkoutUpdates.propTypes = {
  allSets: PropTypes.array.isRequired,
  completedSet: PropTypes.number.isRequired,
  database: PropTypes.array.isRequired
};

export default WorkoutUpdates;
