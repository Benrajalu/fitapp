import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IncrementInput from '../blocks/IncrementInput';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ExerciseCustomizerIntervals extends Component {
  constructor(props) {
    super(props);
    this.handleIntervalAddition = this.handleIntervalAddition.bind(this);
    this.handleIntervalNameChange = this.handleIntervalNameChange.bind(this);
    this.handleExerciseTunning = this.handleExerciseTunning.bind(this);
    this.state = {
      isPressed: false,
      newExerciseName: ''
    };
  }

  handleIntervalNameChange(event) {
    this.setState({
      newExerciseName: event.target.value ? event.target.value : ''
    });
  }

  handleIntervalAddition() {
    this.props.addIntervalExercice(
      this.props.index,
      this.state.newExerciseName
    );
    this.intervalExerciseInput.value = '';
    this.setState({
      newExerciseName: ''
    });
  }

  handleExerciseTunning(index, newValues) {
    const passedValues = newValues.target;
    this.props.newValues(this.props.index, index, passedValues);
  }

  render() {
    const realExercise = this.props.database.filter(
      obj => obj.id === this.props.currentExercise.exerciseId
    )[0];

    let exercises = null,
      totalLength = 0,
      totalLengthString = null;

    if (this.props.currentExercise.exercises.length > 0) {
      exercises = this.props.currentExercise.exercises.map((value, index) => (
        <div className="nested_exerciseTunner" key={`tunner-${index}`}>
          <div className="heading">{value.name}</div>
          <div className="tunners">
            <div className="item">
              <IncrementInput
                value={value.sets}
                name="sets"
                index={index}
                currentExercise={value}
                updater={this.handleExerciseTunning}
                unit="Sets"
              />
            </div>
            <div className="item">
              <IncrementInput
                value={value.active}
                name="active"
                index={index}
                currentExercise={value}
                updater={this.handleExerciseTunning}
                unit="secondes d'activité"
              />
            </div>
            <div className="item">
              <IncrementInput
                value={value.pause}
                name="pause"
                index={index}
                currentExercise={value}
                updater={this.handleExerciseTunning}
                unit="Secondes de repos"
              />
            </div>
          </div>
        </div>
      ));

      totalLength += this.props.currentExercise.exercises
        .map(value => value.sets * (value.active + value.pause))
        .reduce((accu, value) => accu + value);

      let getMinutes =
        Math.floor(totalLength / 60) < 10
          ? `0${Math.floor(totalLength / 60)}`
          : Math.floor(totalLength / 60);
      let getRemainingSeconds =
        totalLength % 60 < 10 ? `0${totalLength % 60}` : totalLength % 60;

      totalLengthString = `${getMinutes}:${getRemainingSeconds}`;
    }

    return (
      <div className="exercise-tuner">
        <div className="order">
          <p className="legend">
            <FontAwesomeIcon icon={['fas', 'sort']} size="1x" /> Ordre
          </p>
          <button
            onClick={this.props.organize.bind(this, this.props.index, 'up')}
            className="btn btn-default btn-up"
            type="button"
            disabled={this.props.index === 0 ? true : false}>
            <i className="fa fa-angle-up" />
          </button>
          <button
            onClick={this.props.organize.bind(this, this.props.index, 'down')}
            className="btn btn-default btn-down"
            type="button"
            disabled={this.props.last ? true : false}>
            <i className="fa fa-angle-down" />
          </button>
        </div>
        <div className="description">
          <div className="heading">
            <h3 className="title">{realExercise ? realExercise.name : ''}</h3>
            <button
              type="button"
              title="Retirer cet exercice"
              className="remove"
              onClick={this.props.removeExercise.bind(this, this.props.index)}>
              <FontAwesomeIcon icon={['fas', 'trash']} size="1x" />
            </button>
          </div>
          <div className="body">
            <div className="actions">
              <input
                form="nestedForm"
                contentEditable="true"
                className="module-title"
                placeholder="Nom de l'exercice"
                value={this.state.newExerciseName}
                ref={element => {
                  this.intervalExerciseInput = element;
                }}
                onChange={this.handleIntervalNameChange.bind(this)}
                onSubmit={this.handleIntervalAddition}
              />
              <button onClick={this.handleIntervalAddition} type="button">
                Ajouter
              </button>
            </div>
            {exercises ? (
              <div className="exercise-list">
                <h3 className="title">
                  Exercices :{' '}
                  <strong>(Durée totale {totalLengthString})</strong>
                </h3>
                <div className="list">{exercises}</div>
              </div>
            ) : (
              <div className="empty">
                Ce type d'entraînement doit comprendre au moins un exercice !
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ExerciseCustomizerIntervals.propTypes = {
  database: PropTypes.array.isRequired,
  currentExercise: PropTypes.object.isRequired
};

export default ExerciseCustomizerIntervals;
