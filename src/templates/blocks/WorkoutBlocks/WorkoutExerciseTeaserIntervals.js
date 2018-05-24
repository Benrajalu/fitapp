import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkoutExerciseTeaserIntervals extends Component {
  constructor(props) {
    super(props);

    this.updateSetlist = this.updateSetlist.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.outputCompletedSets = this.outputCompletedSets.bind(this);

    this.state = {
      exerciseId: this.props.contents.exerciseId,
      setsTarget: 1,
      repTarget: this.props.contents.handicap
    };
  }

  updateSetlist() {
    let newSetlist = [];
    if (this.props.contents.setsTarget && this.props.contents.sets === false) {
      let y = 0,
        totalSets = parseFloat(this.props.contents.setsTarget);
      for (y; y < totalSets; y++) {
        newSetlist.push(0);
      }
    } else if (this.props.contents.setsTarget && this.props.contents.sets) {
      newSetlist = this.props.contents.sets;
    } else if (this.props.contents.handicap && this.props.contents.sets) {
      newSetlist = this.props.contents.sets;
    } else {
      newSetlist.push(0);
    }

    this.setState({
      sets: newSetlist
    });

    this.props.onReps(newSetlist, this.props.index);
  }

  componentDidMount() {
    this.updateSetlist();
  }

  clickHandler() {
    this.props.startStopwatch();
    this.props.showExercise(this.props.index);
  }

  outputCompletedSets() {
    let completedSets = 0;
    let comparableTreshold = this.props.contents.handicap;
    if (this.props.contents.sets) {
      var completed = this.props.contents.sets.filter(value => {
        return value === parseFloat(comparableTreshold);
      });
      completedSets = completed.length ? completed.length : 0;
    }

    return completedSets;
  }

  render() {
    console.log(this.props);
    // Setting up variables
    const currentExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;

    // Translating exercises ID into proper exercises from the exercise database.
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === currentExercise.exerciseId
    )[0];

    let cleanType = trueExercise.type;

    // Swittches to dertermine exercise profile

    // Show the work to be done
    let setNumber = 0,
      exerciseNumber = currentExercise.exercises.length,
      totalDuration = currentExercise.handicap;

    // That is then put trhough a little calculation grinder to get it into a readable string
    let getMinutes =
      Math.floor(totalDuration / 60) < 10
        ? `0${Math.floor(totalDuration / 60)}`
        : Math.floor(totalDuration / 60);
    let getRemainingSeconds =
      totalDuration % 60 < 10 ? `0${totalDuration % 60}` : totalDuration % 60;

    const totalLengthString = `${getMinutes}:${getRemainingSeconds}`;

    setNumber += currentExercise.exercises
      .map(value => value.sets)
      .reduce((accu, value) => accu + value);

    return (
      <div className="routine-log launcher">
        <div className="description">
          <div className="header">
            <h3 className="exercise-name">{trueExercise.name}</h3>
            <p>{cleanType}</p>
          </div>
          <div className="objectives">
            <p>Objectifs</p>
            <div className="units">
              {exerciseNumber ? (
                <p className="reps">
                  <strong>
                    {exerciseNumber < 10 ? '0' : false}
                    {exerciseNumber}
                  </strong>{' '}
                  exo{exerciseNumber > 1 ? 's' : false}
                </p>
              ) : (
                false
              )}
              <p className="sets">
                <strong>
                  {setNumber < 10 ? '0' : false}
                  {setNumber}
                </strong>{' '}
                set{setNumber > 1 ? 's' : false}
              </p>
              {totalDuration ? (
                <p className="handicap">
                  <strong> {totalLengthString}</strong>
                  minutes
                </p>
              ) : (
                false
              )}
            </div>
          </div>
        </div>
        <button className="completion" onClick={this.clickHandler}>
          <div className="copy">
            <p className="counter">
              {this.outputCompletedSets()}/{this.state.setsTarget}
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
                this.outputCompletedSets() * 100 / this.state.setsTarget +
                ', 100'
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

WorkoutExerciseTeaserIntervals.propTypes = {
  contents: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default WorkoutExerciseTeaserIntervals;
