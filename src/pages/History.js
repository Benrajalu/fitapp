import React, { Component } from 'react';

import userData from '../data/users.json';
import exercisesDatabase from '../data/exercises.json';

import WorkoutsLog from '../blocks/WorkoutsLog';
import RecordsLog from '../blocks/RecordsLog';
import WeekCounter from '../blocks/WeekCounter';
import RoutineLauncherModal from '../blocks/RoutineLauncherModal';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const routines = this.state.routinesList.sort((a, b) => {
      var aDate = a.lastPerformed.split('/');
      var bDate = b.lastPerformed.split('/');
      var c = new Date('20' + aDate[2], aDate[1] - 1, aDate[0]);
      var d = new Date('20' + bDate[2], bDate[1] - 1, bDate[0]);
      return c>d ? -1 : c<d ? 1 : 0;
    });

    return (
      <div className="History">
        <div className="container">
          <div className="page-header">
            <h1>Historique</h1>
          </div>
        </div>

        <div className="container">
          <div className="col-md-9">
            <h2>Vos entraînements</h2>
            <WeekCounter list={workouts} />&nbsp;
            <button className="btn btn-primary" onClick={this.displayModal}>Lancer un entraînement</button>
            <hr/>
            <WorkoutsLog list={workouts} exercisesDatabase={this.state.exercises} />
          </div>

          <div className="col-md-3">
            <h2>Vos records</h2>
            <RecordsLog list={records} exercisesDatabase={this.state.exercises} />
          </div>
        </div>

        <RoutineLauncherModal 
          shouldAppear={this.state.modalDisplay ? 'visible' : 'hidden'} 
          routinesList={routines} 
          exercises={this.state.exercises} 
          modalCloser={this.displayModal} />
      </div>
    )
  }
}

export default History;
