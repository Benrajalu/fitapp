import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  find,
  findIndex,
} from 'lodash';
import IntervalExerciseWrapper from './IntervalExerciseWrapper';


class WorkoutExerciseFullIntervals extends Component {
  constructor(props) {
    super(props);
    this.setCompletion = this.setCompletion.bind(this);
    this.makeDurationString = this.makeDurationString.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.timeMachine = this.timeMachine.bind(this);
    this.playList = [];

    this.state = {
      sets: [],
      timeSpent: 0,
      currentRound: { exercise: 0, round: 0 },
      currentTrack: 'track-0-0-active',
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
    this.setState({
      timeSpent: setsSnapshot[0]
    });

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
        else {
          clearTimeout(this.holdTimer);
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
          ends: stackedTime,
          trackId: `track-${index}-${i}-active`,
        });

        stackedTime += item.pause;
        this.playList.push({
          length: item.pause,
          legend: "Pause",
          exerciseIndex: index,
          setIndex: i,
          ends: stackedTime,
          trackId: `track-${index}-${i}-pause`,
        });
      }
    });
  };

  timeKeeper = () => {
    const currentTimeSpent = this.state.timeSpent;
    const currentTrack = this.state.currentTrack;
    const playlist = this.playList;

    const current = find(playlist, (item) => { return item.trackId === currentTrack});
    const currentIndex = findIndex(playlist, (item) => { return item.trackId === currentTrack});

    if(currentTimeSpent > current.ends) {
      const newCurrentTrack = playlist[currentIndex + 1].trackId;
      this.setState({
        currentTrack: newCurrentTrack
      });
    }
  };

  travelBackwards = () => {
    const playlist = this.playList;
    const currentTrack = this.state.currentTrack;
    const currentIndex = playlist.length > 0 ? findIndex(playlist, (item) => { return item.trackId === currentTrack}) : 0;

    if(currentIndex > 0 ){
      clearTimeout(this.holdTimer);
      this.changeStatus('pause');
      let setsSnapshot = this.props.contents.sets;
      setsSnapshot[0] = playlist[currentIndex-1]['ends'] - playlist[currentIndex-1]['length'];
      this.props.onReps(setsSnapshot, this.props.index);
      this.setState({
        currentTrack: playlist[currentIndex-1].trackId,
        timeSpent: setsSnapshot[0],
      }, () => {
        this.changeStatus('playing');
      });
      return;
    }

    return false;

  };

  travelForwards = () => {
    const playlist = this.playList;
    const currentTrack = this.state.currentTrack;
    const currentIndex = playlist.length > 0 ? findIndex(playlist, (item) => { return item.trackId === currentTrack}) : 0;

    if(currentIndex < playlist.length - 1 ){
      clearTimeout(this.holdTimer);
      this.changeStatus('pause');
      let setsSnapshot = this.props.contents.sets;
      setsSnapshot[0] = playlist[currentIndex]['ends'] + 1;
      this.props.onReps(setsSnapshot, this.props.index);
      this.setState({
        currentTrack: playlist[currentIndex+1].trackId,
        timeSpent: setsSnapshot[0],
      }, () => {
        this.changeStatus('playing');
      });
      return;
    }

    return false;

  };

  render() {
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const setList = this.props.contents.exercises;
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === workoutExercise.exerciseId
    )[0];
    const currentTrack = this.state.currentTrack;
    const playlist = this.playList;

    const current = playlist.length > 0 ? find(playlist, (item) => { return item.trackId === currentTrack}) : {
      setIndex: 0,
      exerciseIndex: 0,
    };

    const currentIndex = playlist.length > 0 ? findIndex(playlist, (item) => { return item.trackId === currentTrack}) : 0;
    const previous = currentIndex > 0 ? playlist[currentIndex - 1] : { ends: 0 };


    // Let's display muscle group and tool name
    let cleanType = trueExercise.type;

    return (
      <div className="workout-card">
        <div className="heading">
          <button
            className="direction"
            disabled={this.props.index <= 0}
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
            <div className="interval-set-heading ">
              <div className="info">
                <h4 className="sets-title">Exercice</h4>
                <p>
                  {current.exerciseIndex + 1}/{setList.length}
                </p>
              </div>
              <div className="info">
                <h4 className="sets-title">Temps total restant</h4>
                <p>
                  {this.makeDurationString(
                    this.props.contents.handicap - this.props.contents.sets[0]
                  )}
                </p>
              </div>
              <div className="progressBar">
                <div
                  className="progress"
                  style={{
                    width: `${this.props.contents.sets[0] * 100 / this.props.contents.handicap}%`
                  }}
                >{`${this.props.contents.sets[0] * 100 / this.props.contents.handicap}%`}</div>
              </div>
            </div>
            <div className="interval-capsule">
              <IntervalExerciseWrapper
                current={current}
                setList={setList}
                timeSpent={this.state.timeSpent}
                timeFormater={this.makeDurationString}
                previous={previous}
              />
              <div className="interval-controls">
                <button
                  onClick={this.travelBackwards}>
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
                <button
                  onClick={this.travelForwards}
                >
                  <FontAwesomeIcon icon={['fas', 'step-forward']} size="1x" />
                </button>
              </div>
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
