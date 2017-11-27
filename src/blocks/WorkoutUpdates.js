import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkoutUpdates extends Component {
  render() {
    const currentExercise = this.props.allSets[this.props.completedSet], 
          fullData = this.props.database.filter(obj => obj.id === currentExercise.exerciseId )[0];

    let update = 0, 
        unit = "kg";

    if(fullData.type === "cardio"){
      unit = "minutes";
      update = 10;
    }
    else if(fullData.type === "barbell" || fullData.type === "calisthenics"){
      update = 5
    }
    else{
      update = 2  
    }

    return (
      <div className="workout-update">
        <div><p>L'exercice <strong>"{fullData.name}"</strong> peut passer de <strong>{currentExercise.handicap}{unit}</strong> à <strong>{parseFloat(currentExercise.handicap) + update}{unit}</strong></p></div>
        <button onClick={this.props.notUpdating.bind(this, this.props.completedSet)} className="btn btn-green">Annuler</button>
      </div>
    )
  }
}

WorkoutUpdates.propTypes = {
  allSets: PropTypes.array.isRequired,
  completedSet: PropTypes.number.isRequired,
  database: PropTypes.array.isRequired
}

export default WorkoutUpdates;
