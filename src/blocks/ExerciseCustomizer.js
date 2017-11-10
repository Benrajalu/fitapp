import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExerciseCustomizer extends Component {
  render() {
    const realExercise = this.props.database.filter(obj => obj.id === this.props.currentExercise.exerciseId )[0], 
          realType = realExercise ? realExercise.type : null;

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
      sets = <div className="col">
                <input type="number" name="sets" value={this.props.currentExercise.sets} onChange={this.props.newValues.bind(this, this.props.index)}/>
                <p>Sets</p>
              </div>
    }

    if(this.props.currentExercise.reps){
      reps = <div className="col">
                <input type="number" name="reps" value={this.props.currentExercise.reps} onChange={this.props.newValues.bind(this, this.props.index)}/>
                <p>Reps</p>
              </div>
    }


    return (
      <div className="exercise-tuner">
        <div className="order">
          <button onClick={this.props.organize.bind(this, this.props.index, "up")} className="btn btn-default btn-up" type="button"><i className="fa fa-angle-up"></i></button>
          <button onClick={this.props.organize.bind(this, this.props.index, "down")} className="btn btn-default btn-down" type="button"><i className="fa fa-angle-down"></i></button>
        </div>
        <div className="description">
          <div className="heading">
            <h3 className="title">{realExercise ? realExercise.name : ''}</h3>
          </div>
          <div className="body">
            {sets}
            {reps}
            <div className="col">
              <input type="number" name="handicap" value={this.props.currentExercise.handicap ? this.props.currentExercise.handicap : 0} onChange={this.props.newValues.bind(this, this.props.index)}/>
              <p>{handicapType}</p>
            </div>
          
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
