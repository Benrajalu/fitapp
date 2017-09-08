import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExercisePickerDetails extends Component {
  
  render() {
    const realExercise = this.props.exercisesDatabase.filter(obj => obj.id === this.props.data.id )[0];

    const ExerciseObject = {};
    ExerciseObject.exerciseId = this.props.data.id;
    if(realExercise.type !== "cardio"){
      ExerciseObject.sets = 1;
      ExerciseObject.reps = 1;
      ExerciseObject.handicap = this.props.userSettings ? this.props.userSettings.settings.baseBarebell : 10;
    }
    else{
      ExerciseObject.handicap = 30
    }

    return (
      <div className="exercise panel panel-default" onClick={this.props.handleClick.bind(this, ExerciseObject)} >
        <div className="panel-heading">
          <p>{this.props.data.type} { this.props.data.muscleGroup ? <small>({this.props.data.muscleGroup})</small> : false }</p>
        </div>
        <div className="panel-body">
          <h3>{this.props.data.name}</h3>
        </div>
      </div>
    )
  }
}

ExercisePickerDetails.propTypes = {
  data: PropTypes.object.isRequired
}

export default ExercisePickerDetails;
