import React, { Component } from 'react';
import Routines from '../blocks/Routines';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';



class AllRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routinesList:[], 
      exercises: []
    }
  }
  componentDidMount() {
    this.setState({
      routinesList: userData[0].routines, 
      exercises: exercisesDatabase, 
    });
  }
  
  render() {
    return (
      <div className="AllRoutines">
        <div className="container">
          <div className="page-header">
            <h1>Mes entraînements</h1>
          </div>
          <Routines list={this.state.routinesList} exercisesDatabase={this.state.exercises} />
        </div>
      </div>
    )
  }
}

export default AllRoutines;
