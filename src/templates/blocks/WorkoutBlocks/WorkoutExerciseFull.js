import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SetCounter from '../../blocks/SetCounter';
import IncrementInput from '../../blocks/IncrementInput';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class WorkoutExerciseFull extends Component {
  constructor(props) {
    super(props);
    this.setCompletion = this.setCompletion.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.outputSets = this.outputSets.bind(this);
    this.state = {
      sets: [],
      modalDisplay: {
        warmup: false,
        weightHelper: false
      }
    };
  }

  componentDidMount() {
    // We create a setList in which the requirements for a full exercise to be successful are counted.
    //If any entry is not a 1, then the exercise isn't 100% done
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
      sets: Array.isArray(newSetlist) ? newSetlist : newSetlist.split()
    });

    this.props.onReps(newSetlist, this.props.index);
  }

  setCompletion(data) {
    // The SetCounter element communicates the current value of reps
    // We store that value in the setsSnapshot, storing where we are now
    // And we compare that value to the requested amount of reps. if it's equal to it, then the set is marked completed
    const setsSnapshot = this.outputSets();
    setsSnapshot[data[1]] = parseFloat(data[0]);

    this.props.onReps(setsSnapshot, this.props.index);
  }

  displayModal(data, target, event) {
    // There are two different modals so we have to initialize both and use an argument to find who's who
    const modals = this.state.modalDisplay;
    modals[data] = !modals[data];
    this.setState({
      modalDisplay: modals,
      targetWindow: target
    });
  }

  outputSets() {
    // Update with new setlist if the comonent is reset with new data
    let newSetlist = [];
    if (this.props.contents.setsTarget && this.props.contents.sets === false) {
      // There is a target for sets, but the setlist hasn't been made yet
      let y = 0,
        totalSets = parseFloat(this.props.contents.setsTarget);
      for (y; y < totalSets; y++) {
        newSetlist.push(0);
      }
    } else if (this.props.contents.setsTarget && this.props.contents.sets) {
      // There is a target and it's already been set so we reuse it
      newSetlist = this.props.contents.sets;
    } else if (this.props.contents.handicap && this.props.contents.sets) {
      // There isn't a set target so the target is the handicap (ie: cardio exercices) AND that's been created so we reuse it
      newSetlist = this.props.contents.sets;
    } else {
      // None of the condition apply so we set the sets to 1 entry, at 0
      newSetlist.push(0);
    }

    return Array.isArray(newSetlist) ? newSetlist : newSetlist.split();
  }

  render() {
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const setList = this.outputSets();
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === workoutExercise.exerciseId
    )[0];
    const handicapType = trueExercise.type !== 'cardio' ? 'kg' : 'minutes';
    // We count how many of the sets have been done (1s in the completedSets array)
    const setsDone = setList.filter(
      value =>
        parseFloat(value) ===
        (this.props.contents.repTarget
          ? parseFloat(this.props.contents.repTarget)
          : parseFloat(this.props.contents.handicap))
    );

    // Let's build the sets (ranger sliders to say how many reps you've done in that set)
    let sets = false;
    sets = setList.map((value, index) => (
      <SetCounter
        treshold={
          this.props.contents.repTarget
            ? parseFloat(this.props.contents.repTarget)
            : parseFloat(this.props.contents.handicap)
        }
        repUnit={this.props.contents.repTarget ? 'reps' : 'minutes'}
        index={index}
        key={index}
        onCompletion={this.setCompletion}
        value={parseFloat(value)}
      />
    ));

    // Let's plan warm-ups if the exercise is relevant to warm-ups and feed the resulting variables with required DOM
    let warmupButton = false,
      warmupWindow = false;
    if (
      trueExercise.type === 'barbell' ||
      trueExercise.type === 'dumbbell' ||
      trueExercise.type === 'cable'
    ) {
      warmupButton = (
        <li role="presentation">
          <button
            onClick={this.props.toggleModal.bind(this, {
              type: 'warmup',
              name: trueExercise.name,
              handicap: this.props.contents.handicap,
              repTarget: this.props.contents.repTarget,
              exoType: trueExercise.type
            })}>
            Échauffement
          </button>
        </li>
      );
    }

    // Let's plan a helper window to load your barbell with requisite weights if needed
    let weightHelper;
    if (trueExercise.type === 'barbell') {
      weightHelper = (
        <li role="presentation">
          <button
            onClick={this.props.toggleModal.bind(this, {
              type: 'loadout',
              name: trueExercise.name,
              handicap: this.props.contents.handicap,
              repTarget: this.props.contents.repTarget,
              exoType: trueExercise.type
            })}>
            Barre finale
          </button>
        </li>
      );
    }

    // Let's display muscle group and tool name
    let bodyPart = false,
      cleanType = false;

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

    // If there is no set target, then it's cardio so the set is...1
    const setTarget = this.props.contents.setsTarget
      ? this.props.contents.setsTarget
      : 1;

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
            <p className="subtitle">
              {cleanType} {bodyPart ? ' • ' + bodyPart : false}
            </p>
          </div>
          <button
            className="direction"
            disabled={this.props.last ? true : false}
            onClick={this.props.showExercise.bind(this, this.props.index + 1)}>
            <FontAwesomeIcon icon={['far', 'angle-right']} size="1x" />
          </button>
        </div>
        <div className="body">
          {trueExercise.type !== 'cardio' || warmupButton || weightHelper ? (
            <ul className="helper-buttons">
              {trueExercise.type !== 'cardio' ? (
                <li role="presentation">
                  <a
                    href={
                      'https://www.youtube.com/results?search_query=form+' +
                      trueExercise.name.replace(' ', '+')
                    }
                    target="_blank">
                    Démos youtube
                  </a>
                </li>
              ) : (
                false
              )}
              {warmupButton ? warmupButton : false}
              {weightHelper ? weightHelper : false}
            </ul>
          ) : (
            false
          )}
          <div className="input-zone">
            <IncrementInput
              value={parseFloat(this.props.contents.handicap)}
              updater={this.props.onUpdate}
              index={this.props.index}
              currentExercise={this.props.contents}
              name="handicap"
              unit={handicapType}
            />
          </div>
          <div className="setList">
            <div className="heading">
              <h4 className="sets-title">Sets</h4>
              <div className="completion-small">
                <div className="copy">
                  <p>
                    {setsDone.length}/{setTarget}
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
                        setsDone.length * 100 / setTarget + ', 100'
                    }}
                    d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <div className="sets">{sets}</div>
          </div>
        </div>

        {warmupWindow && this.state.modalDisplay.warmup ? warmupWindow : false}
      </div>
    );
  }
}

WorkoutExerciseFull.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReps: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export default WorkoutExerciseFull;
