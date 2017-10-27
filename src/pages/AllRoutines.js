import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {firebaseAuth, database} from '../utils/fire';

import Routines from '../blocks/Routines';


class AllRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      routinesList:[], 
      exercises: [], 
      user:{}
    }
  }
  componentDidMount() {
    const _this = this;
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        database.collection('users').doc(user.uid).collection('routines').get().then((snapshot) => {
          const output = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
                data.id = doc.id;
            output.push(data);
          });
          _this.setState({
            routinesList: output.length > 0 ? output : false, 
            user: {id: user.uid}
          });
          console.log(_this.state.routinesList);
        });

        database.collection('exercises').get().then((snapshot) => {
          const output = [];
          snapshot.forEach((doc) => {
            output.push(doc.data());
          });
          _this.setState({
            exercises: output,
            loading: false
          })
        });
      } else {
        firebaseAuth.signOut();
      }
    });
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
            <h1>Mes entraînements</h1>
            <Link className="btn btn-default" to='/new-routine'>Créer un nouvel entraînement</Link>
          </div>
          {this.state.loading ? 
            <p>Chargement de vos données...</p>
            :
            <div>
              {this.state.routinesList.length > 0 && this.state.routinesList ? 
                <Routines list={routines} exercisesDatabase={this.state.exercises} editable="true" user={this.state.user} />
                :
                <div className="alert alert-warning">Vous n'avez pas encore créé d'entraînement !</div>
              }
            </div>
          }
        </div>
      </div>
    )
  }
}

export default AllRoutines;
