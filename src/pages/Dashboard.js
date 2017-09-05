import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RoutineLauncherModal from '../blocks/RoutineLauncherModal';
import WorkoutsLog from '../blocks/WorkoutsLog';
import RecordsLog from '../blocks/RecordsLog';
import WeekCounter from '../blocks/WeekCounter';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDisplay: false,
      routinesList:[], 
      exercises: [], 
      workoutList: [], 
      records: []
    };
    this.displayModal = this.displayModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      routinesList: userData[0].routines,
      workoutList: userData[0].workoutLog, 
      records: userData[0].personalRecords,
      exercises: exercisesDatabase, 
    });
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }


  render() {
    // Ensuring workouts and records are always in chronological order
    const workouts = this.state.workoutList.sort((a, b) => {
      var c = a.timestamp;
      var d = b.timestamp;
      return c>d ? -1 : c<d ? 1 : 0;
    });
    const records = this.state.records.sort((a, b) => {
      var c = a.timestamp;
      var d = b.timestamp;
      return c>d ? -1 : c<d ? 1 : 0;
    });

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
            <WeekCounter list={workouts} />
            <Link to="/history" className="btn btn-default">Historique</Link>
            <hr/>
            <WorkoutsLog list={workouts} exercisesDatabase={this.state.exercises} limit="5" />
          </div>

          <div className="col-md-3">
            <h2>Vos records</h2>
            <RecordsLog list={records} exercisesDatabase={this.state.exercises} limit="5" />
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
