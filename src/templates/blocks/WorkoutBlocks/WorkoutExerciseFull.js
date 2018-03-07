import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SetCounter from '../../blocks/SetCounter';
import WeightHelperModal from '../../blocks/WeightHelperModal';

class WorkoutDetails extends Component {
  constructor(props) {
    super(props);
    this.setCompletion = this.setCompletion.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.removeHandicap = this.removeHandicap.bind(this);
    this.addHandicap = this.addHandicap.bind(this);
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
      sets: newSetlist
    });

    this.props.onReps(newSetlist, this.props.index);
  }

  setCompletion(data) {
    // The SetCounter element communicates the current value of reps
    // We store that value in the setsSnapshot, storing where we are now
    // And we compare that value to the requested amount of reps. if it's equal to it, then the set is marked completed
    const setsSnapshot = this.state.sets;
    setsSnapshot[data[1]] = parseFloat(data[0]);
    this.setState({
      sets: setsSnapshot
    });

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

  addHandicap(index) {
    const currentValue = parseFloat(this.props.contents.handicap),
      valueObject = {
        target: {
          name: 'handicap',
          value: currentValue + 1
        }
      };
    this.props.onUpdate(index, valueObject);
  }

  removeHandicap(index) {
    const currentValue = parseFloat(this.props.contents.handicap),
      valueObject = {
        target: {
          name: 'handicap',
          value: currentValue > 0 ? currentValue - 1 : 0
        }
      };
    this.props.onUpdate(index, valueObject);
  }

  componentWillReceiveProps(nextProps) {
    // Update with new setlist if the comonent is reset with new data
    let newSetlist = [];
    if (nextProps.contents.setsTarget && nextProps.contents.sets === false) {
      let y = 0,
        totalSets = parseFloat(nextProps.contents.setsTarget);
      for (y; y < totalSets; y++) {
        newSetlist.push(0);
      }
    } else if (nextProps.contents.setsTarget && nextProps.contents.sets) {
      newSetlist = nextProps.contents.sets;
    } else if (nextProps.contents.handicap && nextProps.contents.sets) {
      newSetlist = nextProps.contents.sets;
    } else {
      newSetlist.push(0);
    }

    this.setState({
      sets: newSetlist
    });
    console.log(newSetlist);
  }

  render() {
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === workoutExercise.exerciseId
    )[0];
    const handicapType = trueExercise.type !== 'cardio' ? 'kg' : 'minutes';
    // We count how many of the sets have been done (1s in the completedSets array)
    const setsDone = this.state.sets.filter(
      value =>
        value ===
        (this.props.contents.repTarget
          ? parseFloat(this.props.contents.repTarget)
          : parseFloat(this.props.contents.handicap))
    );

    // Let's build the sets (ranger sliders to say how many reps you've done in that set)
    let sets = false;
    sets = this.state.sets.map((value, index) => (
      <SetCounter
        treshold={
          this.props.contents.repTarget
            ? parseInt(this.props.contents.repTarget, 10)
            : parseInt(this.props.contents.handicap, 10)
        }
        repUnit={this.props.contents.repTarget ? 'reps' : 'minutes'}
        index={index}
        key={index}
        onCompletion={this.setCompletion}
        value={value}
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
          <button onClick={this.displayModal.bind(this, 'warmup', 'warmup')}>
            Échauffement
          </button>
        </li>
      );
      warmupWindow = (
        <WeightHelperModal
          closeModal={this.displayModal.bind(this, 'warmup')}
          shouldAppear={this.state.modalDisplay.warmup ? 'visible' : 'hidden'}
          targetWindow={
            this.state.targetWindow ? this.state.targetWindow : 'warmup'
          }
          name={trueExercise.name}
          weight={workoutExercise.handicap}
          maxReps={
            workoutExercise.repTarget ? workoutExercise.repTarget : false
          }
          type={trueExercise.type}
          settings={this.props.settings}
        />
      );
    }

    // Let's plan a helper window to load your barbell with requisite weights if needed
    let weightHelper;
    if (trueExercise.type === 'barbell') {
      weightHelper = (
        <li role="presentation">
          <button onClick={this.displayModal.bind(this, 'warmup', 'loadout')}>
            Répartition des poids
          </button>
        </li>
      );
    }

    // If there is no set target, then it's cardio so the set is...1
    const setTarget = this.props.contents.setsTarget
      ? this.props.contents.setsTarget
      : 1;

    return (
      <div className="workout-card">
        <div className="heading" onClick={this.changeDisplay}>
          <h3 className="title">
            {trueExercise.name}{' '}
            <strong
              className={
                parseFloat(setTarget) === setsDone.length ? 'done' : ''
              }>
              {setsDone.length}/{setTarget}
            </strong>
          </h3>
          {this.state.visible ? (
            <button
              onClick={this.changeDisplay}
              className="btn btn-primary"
              title={
                this.state.visible ? "Fermer l'exercice" : "Ouvrir l'exercice"
              }>
              <i className="fa fa-angle-up" />
            </button>
          ) : (
            <button
              onClick={this.changeDisplay}
              className="btn btn-primary"
              title={
                this.state.visible ? "Fermer l'exercice" : "Ouvrir l'exercice"
              }>
              <i className="fa fa-angle-down" />
            </button>
          )}
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
            <button
              className="value-button"
              onClick={this.removeHandicap.bind(this, this.props.index)}>
              <i className="fa fa-minus" />
            </button>
            <div className="input">
              <input
                type="number"
                name="handicap"
                value={this.props.contents.handicap}
                onChange={this.props.onUpdate.bind(this, this.props.index)}
              />
              <p>{handicapType}</p>
            </div>
            <button
              className="value-button"
              onClick={this.addHandicap.bind(this, this.props.index)}>
              <i className="fa fa-plus" />
            </button>
          </div>
          {sets}
        </div>

        {warmupWindow && this.state.modalDisplay.warmup ? warmupWindow : false}
      </div>
    );
  }
}

WorkoutDetails.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReps: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export default WorkoutDetails;
