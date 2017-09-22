import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WorkoutUpdates extends Component {
  render() {
    const currentExercise = this.props.allSets[this.props.completedSet], 
          fullData = this.props.database.filter(obj => obj.id === currentExercise.exerciceId )[0];

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
      <div className="alert alert-success">
        <strong>{fullData.name}</strong> peut passer de <strong>{currentExercise.handicap}{unit}</strong> à <strong>{parseFloat(currentExercise.handicap) + update}{unit}</strong>
        <button onClick={this.props.notUpdating.bind(this, this.props.completedSet)} className="btn btn-default">Nope!</button>
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
