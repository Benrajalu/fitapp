import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseListing extends Component {
  render() {
    const currentExercise = this.props.exerciseData;
    const exercisesDatabase = this.props.exercisesDatabase;

    // Translating exercises ID into proper exercises from the exercise database. 
    const trueExercise = exercisesDatabase.filter(obj => obj.id === currentExercise.exerciceId )[0];

    // Using the Exercise database, determine the handicap unit related to the picked exercises
    let unit = false;
    switch (trueExercise.type) {
      case 'barbell':
      case 'dumbbell':
      case 'cable':
      case 'calisthenics':
        unit = 'kg'
      break;

      case 'cardio':
        unit = 'minutes';
      break;

      default:
        unit = false;
    }

    function setEngine(data) {
      const numberOfSets = data.sets ? data.sets : 1,
            numberOfReps = data.reps ? data.reps : 1,
            handicap = data.handicap, 
            sets = [];
      let i = 0;

      for(i; i<numberOfSets; i++){
        sets.push(
          <div className="set" key={i + trueExercise.name}>
            <p>{numberOfReps} { handicap ? 'x ' + (handicap + unit) : 'reps'}</p>
          </div>
        )
      }

      return sets;
    }

    return (
      <div>
        <h3>{trueExercise.name}</h3>
        {setEngine(currentExercise)}
      </div>
    )
  }
}

ExerciseListing.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default ExerciseListing;
