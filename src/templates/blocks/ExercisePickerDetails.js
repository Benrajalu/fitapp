import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class ExercisePickerDetails extends Component {
  render() {
    const realExercise = this.props.exercisesDatabase.filter(
      obj => obj.id === this.props.data.id
    )[0];

    const ExerciseObject = {};
    ExerciseObject.exerciseId = this.props.data.id;
    if (
      realExercise.type !== 'cardio' &&
      realExercise.type !== 'calisthenics'
    ) {
      ExerciseObject.sets = 1;
      ExerciseObject.reps = 1;
      ExerciseObject.handicap = this.props.userSettings
        ? this.props.userSettings.settings.baseBarbell
        : 10;
    } else if (realExercise.type === 'calisthenics') {
      ExerciseObject.sets = 1;
      ExerciseObject.reps = 1;
      ExerciseObject.handicap = 0;
    } else {
      ExerciseObject.handicap = 30;
    }

    let trueType, trueMuscle;

    switch (this.props.data.type) {
      case 'barbell':
        trueType = 'Barre';
        break;

      case 'dumbbell':
        trueType = 'Haltères';
        break;

      case 'calisthenics':
        trueType = 'Calisthenics';
        break;

      case 'cardio':
        trueType = 'Cardio';
        break;

      case 'cable':
        trueType = 'Câble';
        break;

      default:
        trueType = false;
    }

    switch (this.props.data.muscleGroup) {
      case 'upper-body':
        trueMuscle = 'Haut du corps';
        break;

      case 'lower-body':
        trueMuscle = 'Bas du corps';
        break;

      default:
        trueMuscle = false;
    }

    return (
      <div className="exercise-panel">
        <button
          className="description"
          onClick={this.props.handleClick.bind(this, ExerciseObject)}>
          <div className="exercise-heading">
            <h3>{this.props.data.name}</h3>
            <p>
              {trueType} {trueMuscle ? <small> • {trueMuscle}</small> : false}
            </p>
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={['far', 'plus']} size="1x" />
          </div>
        </button>
        <div className="exercise-footer">
          <a
            href={
              'https://www.youtube.com/results?search_query=form+' +
              this.props.data.name.replace(' ', '+')
            }
            target="_blank">
            <span>Démos youtube</span>
            <div className="icon">
              <FontAwesomeIcon icon={['far', 'question-circle']} size="1x" />
            </div>
          </a>
        </div>
      </div>
    );
  }
}

ExercisePickerDetails.propTypes = {
  data: PropTypes.object.isRequired
};

export default ExercisePickerDetails;
