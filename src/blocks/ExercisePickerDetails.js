import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExercisePickerDetails extends Component {
  
  render() {
    const realExercise = this.props.exercisesDatabase.filter(obj => obj.id === this.props.data.id )[0];

    const ExerciseObject = {};
    ExerciseObject.exerciseId = this.props.data.id;
    if(realExercise.type !== "cardio" && realExercise.type !== "calisthenics"){
      ExerciseObject.sets = 1;
      ExerciseObject.reps = 1;
      ExerciseObject.handicap = this.props.userSettings ? this.props.userSettings.settings.baseBarbell : 10;
    }
    else if (realExercise.type === "calisthenics"){
      ExerciseObject.sets = 1;
      ExerciseObject.reps = 1;
      ExerciseObject.handicap = 0;  
    }
    else{
      ExerciseObject.handicap = 30
    }

    return (
      <div className="exercise-panel">
        <div className="description">
          <div className="exercise-heading">
            <p>{this.props.data.type} { this.props.data.muscleGroup ? <small>({this.props.data.muscleGroup})</small> : false }</p>
          </div>
          <div className="exercise-body">
            <h3>{this.props.data.name}</h3>
          </div>
          <div className="exercise-footer">
            <a href={"https://www.youtube.com/results?search_query=form+" + this.props.data.name.replace(' ', '+')} target="_blank">Démos youtube</a>
          </div>
        </div>
        <div className="action">
          <button onClick={this.props.handleClick.bind(this, ExerciseObject)}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
    )
  }
}

ExercisePickerDetails.propTypes = {
  data: PropTypes.object.isRequired
}

export default ExercisePickerDetails;
