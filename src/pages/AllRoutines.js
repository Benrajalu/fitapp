import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
    // Routines are sorted by most recently performed to never used ever
    const routines = this.state.routinesList.sort((a, b) => {
      var aDate = a.lastPerformed.split('/');
      var bDate = b.lastPerformed.split('/');
      var c = new Date('20' + aDate[2], aDate[1] - 1, aDate[0]);
      var d = new Date('20' + bDate[2], bDate[1] - 1, bDate[0]);
      return c>d ? -1 : c<d ? 1 : 0;
    });

    return (
      <div className="AllRoutines">
        <div className="container">
          <div className="page-header">
            <h1>Mes entraînements</h1>
            <Link className="btn btn-default" to='/new-routine'>Créer un nouvel entraînement</Link>
          </div>
          <Routines list={routines} exercisesDatabase={this.state.exercises} />
        </div>
      </div>
    )
  }
}

export default AllRoutines;
