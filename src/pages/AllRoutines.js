import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {firebaseAuth, database} from '../utils/fire';

import Routines from '../blocks/Routines';

import '../styles/AllRoutines.css';


class AllRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      routinesList:[], 
      exercises: [], 
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"} 
    };
    this.refreshRoutines = this.refreshRoutines.bind(this);
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
    const user = this.state.user;
    user.id = user.uid;
    this.setState({
      user: user
    });

    // Binding the listeners created above to this component
    this.routinesListener = this.routinesListener.bind(this);
    this.routinesListener();

    this.exercisesListener = this.exercisesListener.bind(this);
    this.exercisesListener();
  }

  componentWillUnmount() {
    this.routinesListener = undefined;
    this.exercisesListener = undefined;
  }

  refreshRoutines(){
    this.routinesListener();
  }
  
  render() {
    // Routines are sorted by most recently performed to never used ever
    let routines =[];
    if(this.state.routinesList.length > 0 && this.state.routinesList){
      routines = this.state.routinesList.sort((a, b) => {
        var aDate = a.lastPerformed.split('/');
        var bDate = b.lastPerformed.split('/');
        var c = new Date('20' + aDate[2], aDate[1] - 1, aDate[0]);
        var d = new Date('20' + bDate[2], bDate[1] - 1, bDate[0]);
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

    return (
      <div className="AllRoutines">
        <div className="container">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
            <h1>Mes entraînements</h1>
          </div>
        </div>
          {this.state.loading ? 
            <div className="container empty">
              <div className="inlineLoader"><p>Chargement de vos données</p></div>
            </div>
            :
            <div className="container">
              {this.state.routinesList.length > 0 && this.state.routinesList ? 
                <div className="all-routines">
                  <Link className="btn btn-default" to='/new-routine'>Créer un nouvel entraînement</Link>
                  <Routines rebuild={this.refreshRoutines} list={routines} exercisesDatabase={this.state.exercises} editable="true" user={this.state.user} refresh={this.refreshRoutines}/>
                </div>
                :
                <div className="empty-workouts">
                  <p>Nous n'avez enregistré aucun entrainement pour l'instant !</p>
                  <Link className="btn btn-default" to='/new-routine'>Créer un nouvel entraînement</Link>
                </div>
              }
            </div>
          }
      </div>
    )
  }
}

export default AllRoutines;
