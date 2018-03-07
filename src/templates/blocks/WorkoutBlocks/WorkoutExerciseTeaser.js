import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkoutExerciseTeaser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exerciseId: this.props.contents.exerciseId,
      setsTarget: this.props.contents.setsTarget
        ? this.props.contents.setsTarget
        : 1,
      repTarget: this.props.contents.repTarget
        ? this.props.contents.repTarget
        : this.props.contents.handicap,
      completedSets: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    // Show the work already done
    let completedSets = 0;
    let comparableTreshold = nextProps.contents.repTarget
      ? nextProps.contents.repTarget
      : nextProps.contents.handicap;
    if (nextProps.contents.sets) {
      var completed = nextProps.contents.sets.filter(value => {
        return value === parseFloat(comparableTreshold);
      });
      completedSets = completed.length ? completed.length : 0;
    }
    this.setState({
      completedSets: completedSets
    });
  }

  componentWillUnmount() {
    console.log('yep');
  }

  render() {
    // Setting up variables
    const currentExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;

    // Translating exercises ID into proper exercises from the exercise database.
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === currentExercise.exerciseId
    )[0];

    let unit = false,
      bodyPart = false,
      cleanType = false;

    // Swittches to dertermine exercise profile
    switch (trueExercise.type) {
      case 'barbell':
      case 'dumbbell':
      case 'cable':
      case 'calisthenics':
        unit = 'kg';
        break;

      case 'cardio':
        unit = 'min';
        break;

      default:
        unit = false;
    }

    switch (trueExercise.type) {
      case 'barbell':
        cleanType = 'Barre';
        break;
      case 'dumbbell':
        cleanType = 'Haltère';
        break;
      case 'cable':
        cleanType = 'Câble';
        break;
      case 'calisthenics':
        cleanType = 'Calisthenics';
        break;
      case 'cardio':
        cleanType = 'Cardio';
        break;
      default:
        cleanType = false;
    }

    switch (trueExercise.muscleGroup) {
      case 'lower-body':
        bodyPart = 'Bas du corps';
        break;
      case 'upper-body':
        bodyPart = 'Haut du corps';
        break;
      default:
        bodyPart = false;
    }

    // Show the work to be done
    const setNumber = parseFloat(currentExercise.setsTarget);
    const repTarget = currentExercise.repTarget
      ? currentExercise.repTarget
      : false;

    return (
      <div className="routine-log launcher">
        <div className="description">
          <div className="header">
            <h3 className="exercise-name">{trueExercise.name}</h3>
            {cleanType ? (
              <p>
                {cleanType} {bodyPart ? <span>• {bodyPart}</span> : false}{' '}
              </p>
            ) : (
              false
            )}
          </div>
          <div className="objectives">
            <p>Objectifs</p>
            <div className="units">
              <p className="sets">
                <strong>
                  {setNumber < 10 ? '0' : false}
                  {currentExercise.setsTarget ? setNumber : '01'}
                </strong>{' '}
                set{setNumber > 1 ? 's' : false}
              </p>
              {currentExercise.repTarget || currentExercise.reps ? (
                <p className="reps">
                  <strong>
                    {repTarget < 10 ? '0' : false}
                    {repTarget}
                  </strong>{' '}
                  rep{repTarget > 1 ? 's' : false}
                </p>
              ) : (
                false
              )}
              {currentExercise.handicap ? (
                <p className="handicap">
                  <strong> {currentExercise.handicap}</strong> {unit}
                </p>
              ) : (
                false
              )}
            </div>
          </div>
        </div>
        <button
          className="completion"
          onClick={this.props.showExercise.bind(this, this.props.index)}>
          <div className="copy">
            <p className="counter">
              {this.state.completedSets}/{this.state.setsTarget}
            </p>
            <p>START!</p>
          </div>
          <svg
            viewBox="0 0 36 36"
            preserveAspectRatio="xMidYMid meet"
            className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={
                this.state.completedSets * 100 / this.state.setsTarget + ', 100'
              }
              d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </button>
      </div>
    );
  }
}

WorkoutExerciseTeaser.propTypes = {
  contents: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default WorkoutExerciseTeaser;
