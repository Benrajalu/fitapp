import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RoutineLauncherModal from '../blocks/RoutineLauncherModal';
import WorkoutsLog from '../blocks/WorkoutsLog';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDisplay: false,
      routinesList:[], 
      exercises: [], 
      workoutList: []
    };
    this.displayModal = this.displayModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      routinesList: userData[0].routines,
      workoutList: userData[0].workoutLog, 
      exercises: exercisesDatabase, 
    });
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }


  render() {
    return (
      <div className="Dashboard">
        <div className="container">
          <div className="col-md-12">
            <div className="page-header">
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="col-md-4">
            <button className="btn btn-primary btn-lg btn-block" onClick={this.displayModal}>Lancer un entraînement</button>
          </div>
          <div className="col-md-4">
            <Link to='/new-routine' className="btn btn-default btn-lg btn-block">Créer un entraînement</Link>
          </div>
          <div className="col-md-4">
            <Link to='/settings' className="btn btn-default btn-lg btn-block">Paramètres</Link>
          </div>
          <div className="col-md-12">
            <hr/>
          </div>
        </div>

        <div className="container">
          <div className="col-md-9">
            <h2>Vos entraînements récents</h2>
            <WorkoutsLog list={this.state.workoutList} exercisesDatabase={this.state.exercises} />
          </div>

          <div className="col-md-3">
            <h2>Vos records</h2>
          </div>
        </div>

        <RoutineLauncherModal 
          shouldAppear={this.state.modalDisplay ? 'visible' : 'hidden'} 
          routinesList={this.state.routinesList} 
          exercises={this.state.exercises} 
          modalCloser={this.displayModal} />
      </div>
    )
  }
}

export default Dashboard;
