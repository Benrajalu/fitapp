import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SetCounter from '../blocks/SetCounter';

class WorkoutDetails extends Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.setCompletion = this.setCompletion.bind(this);
    this.state = {
      visible: false,
      completedSets: []
    }
  }

  componentDidMount() {
    if(this.props.index === 0){
      this.setState({
        visible: true
      })
    }
      
    // We create a setList in which the requirements for a full exercise to be successful are counted. 
    //If any entry is not a 1, then the exercise isn't 100% done
    let setList = [];
    if(this.props.contents.sets){
      let y = 0, 
          totalSets = parseInt(this.props.contents.sets, 10);
      console.log(totalSets);
      for(y; y < totalSets; y++){
        setList.push(0);
      }
    }
    else{
      setList = [0];
    }
    this.setState({
      completedSets: setList
    })
  }

  changeDisplay(event) {
    // This is use to toggle the visibility of the sets 
    this.setState({
      visible: !this.state.visible
    })
  }

  setCompletion(data){
    // The SetCounter element communicates the current value of reps as a true / false statement
    // If true, then the set is completed (all reps done)
    // If fale, it isn't! 
    const setsSnapshot = this.state.completedSets;
    if(data[0]){
      setsSnapshot[data[1]] = 1;
    }
    else{
      setsSnapshot[data[1]] = 0;
    }
    this.setState({
      completedSets: setsSnapshot
    });
  }

  render() {
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === workoutExercise.exerciceId )[0];
    const handicapType = trueExercise.type !== "cardio" ? "kg" : "minutes";
    // We count how many of the sets have been done (1s in the completedSets array)
    const setsDone = this.state.completedSets.filter(value =>  value > 0);

    let sets = false;
    if(this.props.contents.sets){
      sets = [];
      let x = 0;
      const total = parseInt(this.props.contents.sets, 10);

      for(x ; x < total; x++){
        sets.push(<SetCounter reps={parseInt(this.props.contents.reps,10)} index={x} key={x} onCompletion={this.setCompletion} />);
      }
    }

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{trueExercise.name} {setsDone.length}/{this.props.contents.sets ? this.props.contents.sets : 1}</h3>
          <button onClick={this.changeDisplay} className="btn btn-primary">{this.state.visible ? "Hide" : "Show"} routine</button>
        </div>
        { this.state.visible ? 
          <div className="panel-body">
            <div className="text-center">
              <input type="number" name="handicap" value={this.props.contents.handicap} onChange={this.props.onUpdate.bind(this, this.props.index)} />
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
