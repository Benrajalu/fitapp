import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RoutineLauncherModal from '../blocks/RoutineLauncherModal';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDisplay: false,
      routinesList:[], 
      exercises: []
    };
    this.displayModal = this.displayModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      routinesList: userData[0].routines, 
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
          <div className="page-header">
            <h1>Dashboard</h1>
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
