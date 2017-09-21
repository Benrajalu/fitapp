import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SetCounter from '../blocks/SetCounter';
import WarmUp from '../blocks/WarmUp';
import WeightHelper from '../blocks/WeightHelper';

class WorkoutDetails extends Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.setCompletion = this.setCompletion.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.state = {
      visible: false,
      sets: [],
      completedSets: [],
      modalDisplay: {
        warmup: false,
        weightHelper: false
      } 
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
    const setArrays = [[], []];
    if(this.props.contents.sets){
      let y = 0, 
          totalSets = parseInt(this.props.contents.sets, 10);
      for(y; y < totalSets; y++){
        setArrays[0].push(0);
        setArrays[1].push(0);
      }
    }
    else{
      setArrays[0].push(0);
      setArrays[1].push(0);
    }
    this.setState({
      completedSets: setArrays[0], 
      sets: setArrays[1]
    })

    this.props.onReps(setArrays[1], this.props.index);
  }

  changeDisplay(event) {
    // This is use to toggle the visibility of the sets 
    this.setState({
      visible: !this.state.visible
    })
  }

  setCompletion(data){
    // The SetCounter element communicates the current value of reps
    // We store that value in the setsSnapshot, storing where we are now
    // And we compare that value to the requested amount of reps. if it's equal to it, then the set is marked completed
    const completion = this.state.completedSets;
    const setsSnapshot = this.state.sets;
    const ceiling = this.props.contents.reps ? parseInt(this.props.contents.reps, 10) : parseInt(this.props.contents.handicap, 10);
    if(data[0] === ceiling){
      completion[data[1]] = 1;
    }
    else{
      completion[data[1]] = 0;
    }
    setsSnapshot[data[1]] = parseInt(data[0], 10);
    this.setState({
      completedSets: completion,
      sets: setsSnapshot
    });

    this.props.onReps(setsSnapshot, this.props.index);
  }

  displayModal(data, event) {
    // There are two different modals so we have to initialize both and use an argument to find who's who 
    const modals = this.state.modalDisplay;
    modals[data] = !modals[data];
    this.setState({
      modalDisplay: modals
    })
  }

  render() {
    // Setting up variables
    const workoutExercise = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === workoutExercise.exerciceId )[0];
    const handicapType = trueExercise.type !== "cardio" ? "kg" : "minutes";
    // We count how many of the sets have been done (1s in the completedSets array)
    const setsDone = this.state.completedSets.filter(value =>  value > 0);
    
    // Let's build the sets (ranger sliders to say how many reps you've done in that set)
    let sets = false;
    sets = this.state.sets.map((value, index) => 
      <SetCounter reps={this.props.contents.reps ? parseInt(this.props.contents.reps, 10) : parseInt(this.props.contents.handicap, 10)} repUnit={this.props.contents.reps ? "reps" : "minutes"} index={index} key={index} onCompletion={this.setCompletion} value={value} />
    );
    
    // Let's plan warm-ups if the exercise is relevant to warm-ups and feed the resulting variables with required DOM
    let warmupButton = false, 
        warmupWindow = false;
    if(trueExercise.type === "barbell" || trueExercise.type === "dumbbell" || trueExercise.type === "cable"){
      warmupButton = <li role="presentation"><a onClick={this.displayModal.bind(this, 'warmup')}>Échauffement</a></li>;
      warmupWindow = <WarmUp closeModal={this.displayModal.bind(this, 'warmup')} shouldAppear={this.state.modalDisplay.warmup ? 'visible' : 'hidden'} name={trueExercise.name} weight={workoutExercise.handicap} maxReps={workoutExercise.reps ? workoutExercise.reps : false} type={trueExercise.type} settings={this.props.settings}/>;
    }
    
    // Let's plan a helper window to load your barbell with requisite weights if needed
    let weightHelper = false, 
        weightWindow = false;
    if(trueExercise.type === "barbell"){
      weightHelper = <li role="presentation"><a onClick={this.displayModal.bind(this, 'weightHelper')}>Répartition des poids</a></li>;
      weightWindow = <WeightHelper closeModal={this.displayModal.bind(this, 'weightHelper')} shouldAppear={this.state.modalDisplay.weightHelper ? 'visible' : 'hidden'} weight={workoutExercise.handicap} settings={this.props.settings} />;
    }


    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading">
          <h3 className="panel-title">{trueExercise.name} {setsDone.length}/{this.props.contents.sets ? this.props.contents.sets : 1}</h3>
          <button onClick={this.changeDisplay} className="btn btn-primary">{this.state.visible ? "Hide" : "Show"} routine</button>
        </div>
        { this.state.visible ? // If the user so chosses, that part of the routine is hidden
          <div>
            <div className="panel-body">
              <div className="text-center">
                <input type="number" name="handicap" value={this.props.contents.handicap} onChange={this.props.onUpdate.bind(this, this.props.index)} />
                <p>{handicapType}</p>
              </div>
              <ul className="nav nav-pills">
                { trueExercise.type !== "cardio" ? <li role="presentation"><a href={"https://www.youtube.com/results?search_query=form+" + trueExercise.name.replace(' ', '+')} target="_blank">Démos youtube</a></li> : false }
                {warmupButton ? warmupButton : false}
                {weightHelper ? weightHelper : false}
              </ul>
              <hr/> 
              {sets}
            </div>
            {warmupWindow ? warmupWindow : false}
            {weightWindow ? weightWindow : false}
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
