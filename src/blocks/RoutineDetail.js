import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { database} from '../utils/fire';

import ExerciseListing from '../blocks/ExerciseListing';


class RoutineDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopin: false, 
      user: this.props.user
    };
    this.togglePopin = this.togglePopin.bind(this);
    this.deleteRoutine = this.deleteRoutine.bind(this);
    if(this.props.user){
      this.userRef = database.collection('users').doc(this.props.user.id);
    }
  }
  togglePopin(){
    this.setState({
      showPopin: !this.state.showPopin
    })
  }
  deleteRoutine(){
    const _this = this;
    this.userRef.collection('routines').doc(this.props.contents.id).delete().then(() => {
      _this.setState({
        killConfirmed:true
      }, () => {
        setTimeout(() => {
         _this.props.refresh();
        }, 1500);
      });
    });
  }

  render() {
    const routineExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;
    const listExercises = routineExercices.map((value, index) => {
      return <ExerciseListing key={value.exerciseId.toString() + '-' + index} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });

    return (
      <div className="routine-detail">
        <div className="routine-heading with-actions">
          <div className="description">
            <h3 className="title">{this.props.contents.name}</h3>
            <i className="color-spot" style={{"backgroundColor" : this.props.contents.color}}></i>
          </div>
          <Link to={'/workout/' + this.props.contents.id} className="action">Débuter l'entraînement</Link>
        </div>
        <div className="routine-body details">
          {listExercises}
        </div>
        {this.props.editable ? 
          <div className="panel-footer">
            <Link to={'/edit/' + this.props.contents.id} className="btn btn-default">Edit</Link>
            &nbsp;
            <button className="btn btn-danger" onClick={this.togglePopin}>Supprimer</button>
          </div>
          : false}
        {this.state.showPopin ? 
          <div className="popin visible">
            <div className="panel panel-danger contents">
              <div className="panel-heading">
                <h3 className="panel-title">Suppression d'un entrainement</h3>
              </div>
              {!this.state.killConfirmed ? 
                <div className="panel-body text-center">
                  <p><strong>Souhaitez vous effacer la routine {this.props.contents.name} ?</strong></p>
                  <p>Cette action est irrémédiable !</p>
                  <button className="btn btn-danger" onClick={this.deleteRoutine}>Supprimer cette routine</button>&nbsp;
                  <button className="btn btn-default" onClick={this.togglePopin}>Annuler</button>
                </div>
                : 
                <div className="panel-body text-center">
                  <p><strong>La routine {this.props.contents.name} a été effacée avec succès</strong></p>
                </div>
              }
            </div>
          </div>
          : false}
      </div>
    )
  }
}

RoutineDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RoutineDetail;
