import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { database} from '../utils/fire';

import ExerciseListing from '../blocks/ExerciseListing';
import RoutineDelete from '../blocks/RoutineDelete';


class RoutineDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopin: false, 
      user: this.props.user,
      animation:{
        perspective: "800px",
        transformOrigin: '50% 0%',
        marginBottom: -30,
        opacity: 0,
        transform: "rotateX(-70deg)"
      }
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
    this.setState({
      deleting: true
    });
    this.userRef.collection('routines').doc(this.props.contents.id).delete().then(() => {
      _this.setState({
        deleting: false,
        killConfirmed:true
      }, () => {
        setTimeout(() => {
         _this.props.refresh();
        }, 1500);
      });
    });
  }

  componentDidMount(){
    const _this = this;
    setTimeout(() => {
      _this.setState({
        animation:{
          perspective: "800px",
          transformOrigin: '50% 100%',
          marginBottom: "15px",
          opacity: 1,
          transform: "rotateX(-0deg)"
        }
      })
    }, this.props.delay);
  }

  render() {
    const routineExercices = this.props.contents.exercises;
    const exercisesDatabase = this.props.exercisesDatabase;
    const listExercises = routineExercices.map((value, index) => {
      return <ExerciseListing key={value.exerciseId.toString() + '-' + index} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });

    return (
      <div className="routine-detail" style={this.state.animation}>
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
          <div className="routine-footer">
            <Link to={'/edit/' + this.props.contents.id} className="btn btn-size-s">Modifier</Link>
            <button className="btn btn-size-s btn-danger" onClick={this.togglePopin}>Supprimer</button>
          </div>
          : false}
        {this.state.showPopin ?
          <RoutineDelete  shouldAppear={this.state.showPopin ? 'visible' : 'hidden'} 
            name={this.props.contents.name} 
            modalCloser={this.togglePopin} 
            deleteRoutine={this.deleteRoutine}
            killConfirmed={this.state.killConfirmed}
            deleting={this.state.deleting}
          />
          : 
          false
        }
      </div>
    )
  }
}

RoutineDetail.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RoutineDetail;
