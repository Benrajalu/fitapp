import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseListing extends Component {
  render() {
    const currentExercise = this.props.exerciseData;
    const exercisesDatabase = this.props.exercisesDatabase;
    const status = this.props.status ? this.props.status : false;

    // Translating exercises ID into proper exercises from the exercise database.
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === currentExercise.exerciseId
    )[0];

    if (trueExercise) {
      // Using the Exercise database, determine the handicap unit and type related to the picked exercises
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

      // Declaring the exercises' set and rep numbers before determining them from report OR routine data
      let setNumber = 0,
        repTarget = 0;

      // If we're displaying a report on a performed exercise, the component will have a "status" prop flag
      let completedSets = 0,
        completedPercentage = 0;
      if (status) {
        // We're now checking data from a past report, regardless of the current Routine shape
        let sets = currentExercise.sets ? currentExercise.sets : [0];

        setNumber = sets.length;
        repTarget = currentExercise.repTarget
          ? currentExercise.repTarget
          : currentExercise.handicap;

        sets.map(data => {
          if (data === parseFloat(repTarget)) {
            return completedSets++;
          } else {
            return false;
          }
        });
        completedPercentage = completedSets / currentExercise.sets.length * 100;
      } else {
        setNumber = parseFloat(currentExercise.sets);
        repTarget = currentExercise.reps ? currentExercise.reps : false;
      }

      return (
        <div className="routine-log">
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
                    {currentExercise.sets ? setNumber : '01'}
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
          {status ? (
            <div className="report">
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: completedPercentage + '%' }}
                />
              </div>
              <p>
                <strong>
                  {completedSets}/{currentExercise.sets.length}
                </strong>{' '}
                <span>–</span> set{currentExercise.sets.length > 1
                  ? 's'
                  : false}{' '}
                complété{currentExercise.sets.length > 1 ? 's' : false}
              </p>
            </div>
          ) : (
            false
          )}
        </div>
      );
    } else {
      return <p>Cet exercice n'existe pas</p>;
    }
  }
}

ExerciseListing.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  status: PropTypes.string
};

export default ExerciseListing;
