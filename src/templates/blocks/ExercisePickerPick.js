import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExercisePickerPick extends Component {

  render() {
    const realExercice = this.props.database.filter(obj => obj.id === this.props.currentExercise.exerciseId )[0];
    return (
      <button className="exercise-pick" onClick={this.props.handleClick.bind(this, this.props.currentExercise.exerciseId)}>{realExercice ? realExercice.name : false} <div className="remove"><i className="fa fa-close"></i></div></button> 
    )
  }
}

ExercisePickerPick.propTypes = {
  database: PropTypes.array.isRequired, 
  currentExercise: PropTypes.object.isRequired, 
  handleClick: PropTypes.func.isRequired
}

export default ExercisePickerPick;
