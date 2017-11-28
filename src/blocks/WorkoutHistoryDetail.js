import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';
import Timestamper from '../blocks/Timestamper';

import "../styles/routine.css"

class WorkoutHistoryDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      getIn:{
        transform:"translateX(-30%)",
        opacity:0
      }
    }
  }
  componentDidMount(){
    const _this = this;
    setTimeout(() => {
      _this.setState({
        getIn:{
          transform:"translateX(0)",
          opacity:"1"
        }
      })
    }, this.props.delay);
  }
  render() {
    const workoutExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;

    const listExercises = workoutExercices.map((value, index) => {
      return <ExerciseListing key={index.toString() + '-' + value.exerciseId.toString()} exerciseData={value} exercisesDatabase={exercisesDatabase} status="past" />
    });

    return (
      <div className="routine-detail" style={this.state.getIn}>
        <div className="routine-heading">
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
          <h3 className="title">{this.props.contents.routineName}</h3>
          <i className="color-spot" style={{"backgroundColor" : this.props.contents.color}}></i>
        </div>
        <div className="routine-body log">
          {listExercises}
        </div>
      </div>
    )
  }
}

WorkoutHistoryDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default WorkoutHistoryDetail;
