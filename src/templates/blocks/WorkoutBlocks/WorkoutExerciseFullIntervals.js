import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SetCounter from '../../blocks/SetCounter';
import IntervalExerciseWrapper from './IntervalExerciseWrapper';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class WorkoutExerciseFullIntervals extends Component {
  constructor(props) {
    super(props);
    this.setCompletion = this.setCompletion.bind(this);
    this.makeDurationString = this.makeDurationString.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.timeMachine = this.timeMachine.bind(this);
    this.playList = [];
    this.timerInterval = undefined;

    this.state = {
      sets: [],
      timeSpent: 0,
      currentRound: { exercise: 0, round: 0 },
      status: 'stopped',
      modalDisplay: {
        warmup: false,
        weightHelper: false
      }
    };
  }

  makeDurationString(seconds) {
    let getMinutes =
      Math.floor(seconds / 60) < 10
        ? `0${Math.floor(seconds / 60)}`
        : Math.floor(seconds / 60);
    let getRemainingSeconds =
      seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;

    return `${getMinutes}:${getRemainingSeconds}`;
  }

  setCompletion() {
    // The props communicates the current value of advancement (in seconds here)
    // We store that value in the setsSnapshot, storing where we are now
    // We then add one to that and communicate it back to the wrapper.
    // Basically we're treating seconds like reps in a single set.
    let setsSnapshot = this.props.contents.sets;
    setsSnapshot[0] = setsSnapshot[0] + 1;

    this.props.onReps(setsSnapshot, this.props.index);
  }

  changeStatus(newStatus) {
    this.makePlayList();
    this.setState(
      {
        status: newStatus
      },
      () => {
        if (this.state.status === 'playing') {
          this.timeMachine();
        }
      }
    );
  }

  timeMachine() {
    this.timeKeeper();
    if (
      this.state.status === 'playing' &&
      this.props.contents.sets[0] < this.props.contents.handicap
    ) {
      let promise = setTimeout(() => {
        this.setCompletion();
        this.timeMachine();
      }, 1000);

      this.holdTimer = promise;
      return true;
    }
    clearTimeout(this.holdTimer);
    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.holdTimer);
  }

  componentDidMount() {
    this.makePlayList();
  }

  makePlayList = () => {
    let stackedTime = 0;
    this.playList.length = 0; // Reinitiate the playlist to avoid stacking it up

    this.props.contents.exercises.map( (item, index) => {
      for(let i = 0; i < item.sets; i++){
        stackedTime += item.active;
        this.playList.push({
          length: item.active,
          legend: "Active",
          exerciseIndex: index,
          setIndex: i,
          ends: stackedTime
        });

        stackedTime += item.pause;
        this.playList.push({
          length: item.pause,
          legend: "Pause",
          exerciseIndex: index,
          setIndex: i,
          ends: stackedTime
        });
      }
    });
    console.log(this.playList);
  };

  timeKeeper = () => {
    const currentTimeSpent = this.state.timeSpent;
    const playlist = this.playList;

    var closest = playlist.reduce( function( previous, current ) {
      return (Math.abs(current.ends - currentTimeSpent) < Math.abs(previous.ends - currentTimeSpent) ? current.ends : previous.ends);
    });

    console.log(closest);
  };

  render() {
    console.log(this.props.contents);
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const setList = this.props.contents.exercises;
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === workoutExercise.exerciseId
    )[0];

    // Let's build the intervals
    let exercises = setList.map((value, index) => (
      <IntervalExerciseWrapper
        index={index}
        total={setList.length}
        key={index}
        onCompletion={this.setCompletion}
        value={value}
        isCurrent={this.state.currentRound.exercise === index}
        currentRound={this.state.currentRound.round}
      />
    ));

    // Let's display muscle group and tool name
    let cleanType = trueExercise.type;

    return (
      <div className="workout-card">
        <div className="heading">
          <button
            className="direction"
            disabled={this.props.index > 0 ? false : true}
            onClick={this.props.showExercise.bind(this, this.props.index - 1)}>
            <FontAwesomeIcon icon={['far', 'angle-left']} size="1x" />
          </button>
          <div className="title-wrap">
            <h3 className="title">{trueExercise.name} </h3>
            <p className="subtitle">{cleanType}</p>
          </div>
          <button
            className="direction"
            disabled={!!this.props.last}
            onClick={this.props.showExercise.bind(this, this.props.index + 1)}>
            <FontAwesomeIcon icon={['far', 'angle-right']} size="1x" />
          </button>
        </div>
        <div className="body">
          <div className="setList">
            <div className="heading">
              <h4 className="sets-title">Temps total restant</h4>
              <div className="completion-small alternate">
                <div className="copy">
                  <p>
                    {this.makeDurationString(
                      this.props.contents.handicap - this.props.contents.sets[0]
                    )}
                  </p>
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
                    style={{
                      strokeDasharray:
                        this.props.contents.sets[0] *
                          100 /
                          this.props.contents.handicap +
                        ', 100'
                    }}
                    d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <div className="sets">{exercises}</div>
            <div className="interval-controls">
              <button>
                <FontAwesomeIcon icon={['fas', 'step-backward']} size="1x" />
              </button>
              <div className="mainAction">
                <button
                  onClick={this.changeStatus.bind(this, 'playing')}
                  className={this.state.status !== 'playing' ? 'active' : ''}>
                  <FontAwesomeIcon icon={['fas', 'play']} size="1x" />
                </button>
                <button
                  onClick={this.changeStatus.bind(this, 'pause')}
                  className={this.state.status === 'playing' ? 'active' : ''}>
                  <FontAwesomeIcon icon={['fas', 'pause']} size="1x" />
                </button>
              </div>
              <button>
                <FontAwesomeIcon icon={['fas', 'step-forward']} size="1x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WorkoutExerciseFullIntervals.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReps: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export default WorkoutExerciseFullIntervals;
