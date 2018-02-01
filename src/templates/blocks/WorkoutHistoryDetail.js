import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExerciseListing from '../blocks/ExerciseListing';
import Timestamper from '../blocks/Timestamper';

import "../../styles/routine.css"

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
          <h3 className="title">{this.props.contents.routineName}</h3>
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
        </div>
        <div className="routine-body log">
          <div className="routine-breakdown">
            <p><strong>{workoutExercices.length}</strong> exercices</p>
            {this.props.contents.duration ? 
              <p><strong>{this.props.contents.duration}</strong> minutes</p>
              : 
              false
            }
            {this.props.contents.calories ? 
              <p><strong>{this.props.contents.calories}</strong> kcalories</p>
              : 
              false
            }
          </div>
          <div className="routine-exercices">
            <div className="list">
              {listExercises}
            </div>
          </div>
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
