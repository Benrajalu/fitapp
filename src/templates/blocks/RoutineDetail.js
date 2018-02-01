import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {TransitionGroup} from 'react-transition-group';

import ExerciseListing from '../blocks/ExerciseListing';
import RoutineDelete from '../blocks/RoutineDelete';
import AnimatedPanel from '../blocks/AnimatedPanel';



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
      }, 
      visibleDetails:false
    };
    this.togglePopin = this.togglePopin.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.deleteRoutine = this.deleteRoutine.bind(this);
    this.userRef = this.props.user;
  }
  togglePopin(){
    this.setState({
      showPopin: !this.state.showPopin
    })
  }
  showDetails(){
    this.setState({
      visibleDetails: !this.state.visibleDetails
    })
  }
  deleteRoutine(){
    /*const _this = this;
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
    });*/
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
    const exercisesDatabase = this.props.exercisesDatabase ? this.props.exercisesDatabase : [];
    const listExercises = routineExercices.map((value, index) => {
      return <ExerciseListing key={value.exerciseId.toString() + '-' + index} exerciseData={value} exercisesDatabase={exercisesDatabase} />
    });
    const exercisesNames = routineExercices.map((value, index) => {
      const trueExercise = exercisesDatabase.filter(obj => obj.id === value.exerciseId )[0];
      return trueExercise ? <li key={value.exerciseId.toString() + '-' + index}>{trueExercise.name}</li> : false;
    });

    return (
      <div>
        <div className="routine-detail" style={this.state.animation}>
          <div className="routine-heading with-actions">
            <button className={this.state.visibleDetails ? "description open" : "description"} onClick={this.showDetails}>
              <span className="icon"><FontAwesomeIcon icon={['far', 'angle-down']} size="1x" /></span>
              <h3 className="title">{this.props.contents.name}</h3>
              <ul className="names">{exercisesNames}</ul>
            </button>
            <Link to={'/workout/' + this.props.contents.id} className="action" onClick={this.props.closeModal.bind(this)}><FontAwesomeIcon icon={['fal', 'play']} size="1x" /> Start !</Link>
          </div>
          <TransitionGroup>
          {this.state.visibleDetails ? 
            <AnimatedPanel>
              <div className="routine-body details">
                {listExercises}
              </div>
            </AnimatedPanel>
            :
            false
          }
          </TransitionGroup>  
          {this.props.editable ? 
            <div className="routine-footer">
              <Link to={'/edit/' + this.props.contents.id} className="btn btn-size-s">Modifier</Link>
              <button className="btn btn-size-s btn-danger" onClick={this.togglePopin}>Supprimer</button>
            </div>
            : false}
        </div>
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
