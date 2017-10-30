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
  }
  togglePopin(){
    this.setState({
      showPopin: !this.state.showPopin
    })
  }
  deleteRoutine(){
    const _this = this;
    database.collection("users").doc(this.props.user.id).collection('routines').doc(this.props.contents.id).delete().then(() => {
      console.log("Kill order confirmed on routine " + this.props.contents.id);
      this.props.rebuild();
      _this.setState({
        killConfirmed:true
      });
      setTimeout(() => {
       _this.togglePopin();
      }, 1500);
    });
  }

  render() {
    const routineExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;
    const listExercises = routineExercices.map((value, index) => {
      return <ExerciseListing key={value.exerciseId.toString() + '-' + index} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });

    return (
      <div className="panel panel-default routine-card">
        <div className="panel-heading container-fluid">
          <div className="col-md-8">
            <h3 className="panel-title">{this.props.contents.name}</h3>
          </div>
          <div className="col-md-4 text-right">
            <Link to={'/workout/' + this.props.contents.id} className="btn btn-primary">Débuter l'entraînement</Link>
          </div>
        </div>
        <div className="panel-body">
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
