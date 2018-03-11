import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkoutTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentExercise: false
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentExercise: nextProps.currentExercise
    });
  }
  componentDidUpdate() {
    if (this.activeEntry) {
      this.activeEntry.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }
  render() {
    const entries = this.props.exercises
      ? this.props.exercises.map((value, index) => {
          const name = this.props.exercisesDatabase.filter(
            data => data.id === value.exerciseId
          )[0].name;
          return (
            <li
              key={index}
              className={
                this.state.currentExercise !== false &&
                this.state.currentExercise === index
                  ? 'active'
                  : null
              }
              ref={
                this.state.currentExercise !== false &&
                this.state.currentExercise === index
                  ? entry => {
                      this.activeEntry = entry;
                    }
                  : null
              }>
              <button onClick={this.props.switchToExercise.bind(this, index)}>
                {name}
              </button>
            </li>
          );
        })
      : false;

    return (
      <ul
        id="workout-tabs"
        className={this.state.currentExercise !== false ? 'visible' : null}>
        {entries}
      </ul>
    );
  }
}

WorkoutTabs.propTypes = {
  exercises: PropTypes.array.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  switchToExercise: PropTypes.func.isRequired
};

export default WorkoutTabs;
