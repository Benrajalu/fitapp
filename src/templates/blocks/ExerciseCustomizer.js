import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ExerciseCustomizer extends Component {
  constructor(props) {
    super(props);
    this.tuneValue = this.tuneValue.bind(this);
    this.holdTimer = undefined;
    this.timer = 500;
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.repeat = this.repeat.bind(this);
    this.state = {
      isPressed: false
    };
  }

  repeat(direction, name, index, event) {
    // Launch the tuner function
    this.tuneValue(direction, name, index, event);
    const _this = this;
    // Set a promise to deliver the same function until the timer is stopped
    let promise = setTimeout(() => {
      _this.repeat(direction, name, index, event);
      this.timer = 200;
    }, this.timer);
    this.holdTimer = promise;
  }

  onMouseDown(direction, name, index, event) {
    if (
      'ontouchstart' in document.documentElement &&
      event.type === 'mousedown'
    ) {
      return false;
    }
    // When button is down, prevent context menu
    window.oncontextmenu = function(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    // Launch the repeat function to then trigger the increase/decrease
    this.repeat(direction, name, index, event);
    this.setState({
      isPressed: name,
      direction: direction
    });
  }
  onMouseUp(event) {
    // When button is up, clear the timeout for the repeater
    clearTimeout(this.holdTimer);
    this.timer = 500;
    // And reinstate the context menu
    window.oncontextmenu = function(event) {
      return true;
    };
    this.setState({
      isPressed: false,
      direction: false
    });
  }

  tuneValue(direction, name, index, event) {
    let newValue, eventObject, value;

    switch (name) {
      case 'reps':
        value = this.props.currentExercise.reps;
        break;

      case 'sets':
        value = this.props.currentExercise.sets;
        break;

      case 'handicap':
        value = this.props.currentExercise.handicap
          ? this.props.currentExercise.handicap
          : 0;
        break;

      default:
        value = null;
    }

    if (direction === 'more') {
      newValue = parseFloat(value) + 1;
      eventObject = {
        target: {
          name: name,
          value: newValue
        }
      };
    } else {
      newValue = parseFloat(value) > 0 ? parseFloat(value) - 1 : 0;
      eventObject = {
        target: {
          name: name,
          value: newValue
        }
      };
    }
    this.props.newValues(this.props.index, eventObject);
  }

  render() {
    const realExercise = this.props.database.filter(
        obj => obj.id === this.props.currentExercise.exerciseId
      )[0],
      realType = realExercise ? realExercise.type : null;

    let handicapType = '',
      sets = false,
      reps = false;

    if (realType !== 'cardio') {
      handicapType = 'kg';
    } else {
      handicapType = 'minutes';
    }

    if (this.props.currentExercise.sets) {
      sets = (
        <div
          className={
            this.state.isPressed && this.state.isPressed === 'sets'
              ? 'col pressed ' + this.state.direction
              : 'col'
          }>
          <button
            className="button"
            type="button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(
              this,
              'less',
              'sets',
              this.props.index
            )}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(
              this,
              'less',
              'sets',
              this.props.index
            )}>
            <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
          </button>
          <div className="input">
            <p>Sets</p>
            <input
              type="number"
              name="sets"
              value={this.props.currentExercise.sets}
              onChange={this.props.newValues.bind(this, this.props.index)}
            />
          </div>
          <button
            className="button"
            type="button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(
              this,
              'more',
              'sets',
              this.props.index
            )}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(
              this,
              'more',
              'sets',
              this.props.index
            )}>
            <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
          </button>
        </div>
      );
    }

    if (this.props.currentExercise.reps) {
      reps = (
        <div
          className={
            this.state.isPressed && this.state.isPressed === 'reps'
              ? 'col pressed ' + this.state.direction
              : 'col'
          }>
          <button
            className="button"
            type="button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(
              this,
              'less',
              'reps',
              this.props.index
            )}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(
              this,
              'less',
              'reps',
              this.props.index
            )}>
            <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
          </button>
          <div className="input">
            <p>Reps</p>
            <input
              type="number"
              name="reps"
              value={this.props.currentExercise.reps}
              onChange={this.props.newValues.bind(this, this.props.index)}
            />
          </div>
          <button
            className="button"
            type="button"
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseDown={this.onMouseDown.bind(
              this,
              'more',
              'reps',
              this.props.index
            )}
            onTouchEnd={this.onMouseUp.bind(this)}
            onTouchCancel={this.onMouseUp.bind(this)}
            onTouchStart={this.onMouseDown.bind(
              this,
              'more',
              'reps',
              this.props.index
            )}>
            <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
          </button>
        </div>
      );
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
            {sets}
            {reps}
            <div
              className={
                this.state.isPressed && this.state.isPressed === 'handicap'
                  ? 'col pressed ' + this.state.direction
                  : 'col'
              }>
              <button
                className="button"
                type="button"
                onMouseUp={this.onMouseUp.bind(this)}
                onMouseDown={this.onMouseDown.bind(
                  this,
                  'less',
                  'handicap',
                  this.props.index
                )}
                onTouchEnd={this.onMouseUp.bind(this)}
                onTouchCancel={this.onMouseUp.bind(this)}
                onTouchStart={this.onMouseDown.bind(
                  this,
                  'less',
                  'handicap',
                  this.props.index
                )}>
                <FontAwesomeIcon icon={['fas', 'minus']} size="1x" />
              </button>
              <div className="input">
                <p>{handicapType}</p>
                <input
                  type="number"
                  name="handicap"
                  value={
                    this.props.currentExercise.handicap
                      ? this.props.currentExercise.handicap
                      : 0
                  }
                  onChange={this.props.newValues.bind(this, this.props.index)}
                />
              </div>
              <button
                className="button"
                type="button"
                onMouseUp={this.onMouseUp.bind(this)}
                onMouseDown={this.onMouseDown.bind(
                  this,
                  'more',
                  'handicap',
                  this.props.index
                )}
                onTouchEnd={this.onMouseUp.bind(this)}
                onTouchCancel={this.onMouseUp.bind(this)}
                onTouchStart={this.onMouseDown.bind(
                  this,
                  'more',
                  'handicap',
                  this.props.index
                )}>
                <FontAwesomeIcon icon={['fas', 'plus']} size="1x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExerciseCustomizer.propTypes = {
  database: PropTypes.array.isRequired,
  currentExercise: PropTypes.object.isRequired
};

export default ExerciseCustomizer;
