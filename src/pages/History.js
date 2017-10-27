import React, { Component } from 'react';
import {firebaseAuth, database} from '../utils/fire';
import { Link } from 'react-router-dom';

import WorkoutsLog from '../blocks/WorkoutsLog';
import RecordsLog from '../blocks/RecordsLog';
import WeekCounter from '../blocks/WeekCounter';
import RoutineLauncherModal from '../blocks/RoutineLauncherModal';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routinesList:false, 
      exercises: [], 
      workoutList: false, 
      records: false, 
      loading: true
    };
    this.displayModal = this.displayModal.bind(this);
  }

  componentDidMount() {
    const _this = this;
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        const userQuery = database.collection('users').doc(user.uid);
        
        database.collection('users').doc(user.uid).collection('routines').get().then((snapshot) => {
          const output = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
                data.id = doc.id;
            output.push(data);
          });
          _this.setState({
            routinesList: output.length > 0 ? output : false
          });
          console.log(_this.state.routinesList);
        });
        
        database.collection('exercises').get().then((snapshot) => {
          const output = [];
          snapshot.forEach((doc) => {
            output.push(doc.data());
          });
          _this.setState({
            exercises: output
          })
        });

        userQuery.get().then((doc) => {
          if(doc.exists){
            const userObj = doc.data();
            userObj.uid = user.uid;

            const workoutLog = userObj.workoutLog ? userObj.workoutLog : false;
            const personalRecords = userObj.personalRecords ? userObj.personalRecords : false;

            _this.setState({
              loading:false,
              workoutList: workoutLog,
              records: personalRecords
            });
          }
          else{

          }
        })
      } else {
        firebaseAuth.signOut();
      }
    });
  }

  displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }


  render() {
    let workouts = [];
    if(this.state.workoutList.length > 0){
      workouts = this.state.workoutList.sort((a, b) => {
        var c = a.timestamp;
        var d = b.timestamp;
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

    let records = [];
    if(this.state.records.length > 0){
      records = this.state.records.sort((a, b) => {
        var c = a.timestamp;
        var d = b.timestamp;
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

    let routines = [];
    if(this.state.routinesList.length > 0){
      routines = this.state.routinesList.sort((a, b) => {
        var aDate = a.lastPerformed.split('/');
        var bDate = b.lastPerformed.split('/');
        var c = new Date('20' + aDate[2], aDate[1] - 1, aDate[0]);
        var d = new Date('20' + bDate[2], bDate[1] - 1, bDate[0]);
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

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
            { this.state.loading ?
              <p>Chargement de vos données...</p>
              :
              <div> 
                {this.state.workoutList ?
                  <div>
                    <WeekCounter list={workouts} />
                    <Link to="/history" className="btn btn-default">Historique</Link>
                    <hr/>
                    <WorkoutsLog list={workouts} exercisesDatabase={this.state.exercises} />
                  </div>
                  :
                  <div>
                    <div className="alert alert-warning">Nous n'avez enregistré aucun entrainement pour l'instant !</div>
                    {this.state.routinesList ? 
                      <button className="btn btn-primary" onClick={this.displayModal}>Lancer un entraînement</button>
                      :
                      <Link to='/new-routine' className="btn btn-default">Créer un entraînement</Link>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <div className="col-md-3">
            <h2>Vos records</h2>
            { this.state.loading ?
              <p>Chargement de vos données...</p>
              : 
              <div>
                {this.state.records ?
                  <RecordsLog list={records} exercisesDatabase={this.state.exercises} />
                  :
                  <div className="alert alert-warning">Aucun record personnel</div> 
                }
              </div>
            }
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
