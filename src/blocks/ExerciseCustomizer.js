import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseCustomizer extends Component {
  render() {
    const realExercice = this.props.database.filter(obj => obj.id === this.props.currentExercise.exerciseId )[0], 
          realType = realExercice.type;

    let handicapType = '',
        sets = false,
        reps = false;

    if(realType !== "cardio"){
      handicapType = "kg";
    }
    else{
      handicapType= "minutes";
    }

    if(this.props.currentExercise.sets){
      sets = <div className="col-xs-4">
                <input type="text" defaultValue={this.props.currentExercise.sets}/>
                <p>Sets</p>
              </div>
    }

    if(this.props.currentExercise.reps){
      reps = <div className="col-xs-4">
                <input type="text" defaultValue={this.props.currentExercise.reps}/>
                <p>Reps</p>
              </div>
    }


    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">{realExercice.name}</h3>
        </div>
        <div className="panel-body container-fluid">
          {sets}
          {reps}
          <div className="col-xs-4">
            <input type="text" defaultValue={this.props.currentExercise.handicap}/>
            <p>{handicapType}</p>
          </div>
  
        </div>
      </div>
    )
  }
}

ExerciseCustomizer.propTypes = {
  database: PropTypes.array.isRequired, 
  currentExercise: PropTypes.object.isRequired
}

export default ExerciseCustomizer;
