import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class WorkoutDetails extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    if(this.props.index === 0){
      this.setState({
        visible: true
      })
    }
  }

  changeDisplay(event) {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleChange(data){
    console.log(data);
  }

  render() {
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === workoutExercise.exerciceId )[0];

    const handicapType = trueExercise.type !== "cardio" ? "kg" : "minutes";

    let sets = false;
    
    if (this.props.contents.sets){
      sets = [];
      const total = parseInt(this.props.contents.sets, 10);
      let i = 1;
      while(i <= total){
        sets.push(
          <div className="panel panel-default" key={"set-" + i}>
            <div className="panel-heading text-center">
              <h4 className="panel-title">Set {i} | 0/{this.props.contents.reps} reps</h4>
            </div>
            <div className="panel-body">
              <Slider
                min={0}
                max={parseInt(this.props.contents.reps, 10)}
                value={0}
                orientation="horizontal"
                onChange={this.handleChange}/>
            </div>
          </div>
        );
        i++;
      }
    }

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{trueExercise.name}</h3>
          <button onClick={this.changeDisplay} className="btn btn-primary">{this.state.visible ? "Hide" : "Show"} routine</button>
        </div>
        { this.state.visible ? 
          <div className="panel-body">
            <div className="text-center">
              <input type="number" defaultValue={this.props.contents.handicap} />
              <p>{handicapType}</p>
            </div>
            {sets}
          </div>
          : false
        }
      </div>
    )
  }
}

WorkoutDetails.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default WorkoutDetails;
