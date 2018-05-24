import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseListingIntervals extends Component {
  render() {
    const currentExercise = this.props.exerciseData;
    const exercisesDatabase = this.props.exercisesDatabase;
    const status = this.props.status ? this.props.status : false;

    // Translating exercises ID into proper exercises from the exercise database.
    const trueExercise = exercisesDatabase.filter(
      obj => obj.id === currentExercise.exerciseId
    )[0];

    if (trueExercise) {
      // Let's get the category this is sitting on from the trueExercise DB pull
      const cleanType = trueExercise.type;

      // Declaring the exercises' variables determining them from report OR routine data
      let setNumber = 0,
        exerciseNumber = currentExercise.exercises.length,
        totalDuration = 0,
        repTarget = 0;

      // Mapping each exercise entry we accumulate the total time each interval must take and gather up a total with reduce()
      totalDuration += currentExercise.exercises
        .map(value => value.sets * (value.active + value.pause))
        .reduce((accu, value) => accu + value);

      // That is then put trhough a little calculation grinder to get it into a readable string
      let getMinutes =
        Math.floor(totalDuration / 60) < 10
          ? `0${Math.floor(totalDuration / 60)}`
          : Math.floor(totalDuration / 60);
      let getRemainingSeconds =
        totalDuration % 60 < 10 ? `0${totalDuration % 60}` : totalDuration % 60;

      const totalLengthString = `${getMinutes}:${getRemainingSeconds}`;

      // /!\ THAT PART IS TODO
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
        setNumber += currentExercise.exercises
          .map(value => value.sets)
          .reduce((accu, value) => accu + value);
        repTarget = currentExercise.reps ? currentExercise.reps : false;
      }

      return (
        <div className="routine-log">
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

ExerciseListingIntervals.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired,
  status: PropTypes.string
};

export default ExerciseListingIntervals;
