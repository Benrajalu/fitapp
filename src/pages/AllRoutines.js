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
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"}, 
      mounted: false
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

  componentDidMount(){
    document.title = "FitApp. - Vos programmes d'entraînement";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }

  refreshRoutines(){
    this.routinesListener();
  }
  
  render() {
    // Routines are sorted by most recently performed to never used ever
    let routines =[];
    if(this.state.routinesList.length > 0 && this.state.routinesList){
      routines = this.state.routinesList.sort((a, b) => {
        var c = new Date(a.lastPerformed);
        var d = new Date(b.lastPerformed);
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }

    return (
      <div className={this.state.mounted ? "AllRoutines loaded" : "AllRoutines"}>
        <div className="container animation-introduction">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
            <h1>Mes entraînements</h1>
          </div>
        </div>
          {this.state.loading ? 
            <div className="container empty animation-contents">
              <div className="inlineLoader"><p>Chargement de vos données</p></div>
            </div>
            :
            <div className="container animation-contents">
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
