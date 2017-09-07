import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ExercisePickerDetails extends Component {
  render() {
    return (
      <div className="exercise panel panel-default" onClick={this.props.handleClick.bind(this, this.props.data.id)} >
        <div className="panel-heading">
          <p>{this.props.data.type} <small>({this.props.data.muscleGroup})</small></p>
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
