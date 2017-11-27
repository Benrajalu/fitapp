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
      loading: true,
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"} 
    };
    this.displayModal = this.displayModal.bind(this);
  }

  routinesListener(){
    const _this = this, 
          user = this.state.user;

    this.fireRoutinesListener = database.collection('users').doc(user.uid).collection('routines').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
            data.id = doc.id;
        output.push(data);
      });
      _this.setState({
        routinesList: output.length > 0 ? output : false
      });
    });
  }

  logListener(){
    const _this = this, 
          user = this.state.user;

    this.fireLogListener = database.collection('users').doc(user.uid).collection('workoutLog').get().then((snapshot) => {
      const workoutLog = [];
      snapshot.forEach((doc) => {
        workoutLog.push(doc.data());
      });
      _this.setState({
        workoutList: workoutLog.length > 0 ? workoutLog : false
      });
    });
  }

  recordsListener(){
    const _this = this, 
          user = this.state.user;

    this.fireRecordsListener = database.collection('users').doc(user.uid).collection('personalRecords').get().then((snapshot) => {
      const personalRecords = [];
      snapshot.forEach((doc) => {
        personalRecords.push(doc.data());
      });
      _this.setState({
        records: personalRecords.length > 0 ? personalRecords : false
      });
    });
  }

  exercisesListener(){
    const _this = this;

    this.fireExercisesListener = database.collection('exercises').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        output.push(doc.data());
      });
      _this.setState({
        exercises: output, 
        loading:false
      })
    });
  }

  componentWillMount() {
    // Binding the listeners created above to this component
    this.routinesListener = this.routinesListener.bind(this);
    this.routinesListener();

    this.logListener = this.logListener.bind(this);
    this.logListener();

    this.recordsListener = this.recordsListener.bind(this);
    this.recordsListener();

    this.exercisesListener = this.exercisesListener.bind(this);
    this.exercisesListener();
  }

  compontentWillUnmout(){
    // Removing the bindings and stopping the events from poluting the state
    this.routinesListener = undefined;
    this.logListener = undefined;
    this.recordsListener = undefined;
    this.exercisesListener = undefined;
  }

  componentDidMount(){
    document.title = "FitApp. - Historique de vos entraînements";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
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
        var c = new Date(a.lastPerformed);
        var d = new Date(b.lastPerformed);
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

    return (
      <div className={this.state.mounted ? "History loaded" : "History"}>
        <div className="container animation-introduction">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
            <h1>Historique</h1>
          </div>
        </div>

        <div className="container animation-contents">
          <div className="large-9 medium-8 columns left-column">
            <h2 className="section-title">Vos entraînements</h2>
            { this.state.loading ?
              <div className="inlineLoader"><p>Chargement de vos données</p></div>
              :
              <div> 
                {this.state.workoutList ?
                  <div className="past-workouts-list">
                    <div className="container no-padding stats">
                      <WeekCounter list={workouts} />
                      <button className="btn btn-green" onClick={this.displayModal}>Commencer un entrainement</button>
                    </div>
                    <WorkoutsLog list={workouts} exercisesDatabase={this.state.exercises} limit="5" />
                  </div>
                  :
                  <div className="empty-workouts">
                    <p>Nous n'avez enregistré aucun entrainement pour l'instant !</p>
                    {this.state.routinesList ? 
                      <button className="btn btn-green" onClick={this.displayModal}>Lancer un entraînement</button>
                      :
                      <Link to='/new-routine' className="btn btn-default">Créer un entraînement</Link>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <div className="large-3 medium-4 columns">
            <div className="records-wrap">
                <h2 className="section-title">Vos records</h2>
                { this.state.loading ?
                  <div className="inlineLoader"><p>Chargement de vos données</p></div>
                  : 
                  <div>
                    {this.state.records ?
                      <RecordsLog list={records} exercisesDatabase={this.state.exercises} />
                      :
                      <div className="empty-state">
                        <p>Aucun record personnel</p>
                      </div> 
                    }
                  </div>
                }
            </div>
          </div>
        </div>

        {this.state.modalDisplay ?
          <RoutineLauncherModal 
          shouldAppear={this.state.modalDisplay ? 'visible' : 'hidden'} 
          routinesList={routines} 
          exercises={this.state.exercises} 
          modalCloser={this.displayModal} />
          :
          false
        }
      </div>
    )
  }
}

export default History;
