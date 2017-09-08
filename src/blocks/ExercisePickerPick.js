import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExercisePickerPick extends Component {
  render() {
    const realExercice = this.props.database.filter(obj => obj.id === this.props.currentExercise )[0];
    return (
      <button className="btn btn-primary" onClick={this.props.handleClick.bind(this, this.props.currentExercise)}>{realExercice.name}</button> 
    )
  }
}

ExercisePickerPick.propTypes = {
  database: PropTypes.array.isRequired, 
  currentExercise: PropTypes.string.isRequired, 
  handleClick: PropTypes.func.isRequired
}

export default ExercisePickerPick;
