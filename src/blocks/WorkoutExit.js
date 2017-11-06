import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WorkoutUpdates from '../blocks/WorkoutUpdates';

class WorkoutExit extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      animate: " animate"
    }
  }
  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
  }

  closeModal() {
    const _this = this;
    this.setState({
      animate: " animate"
    });
    setTimeout(function(){
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeRoutineModal();
    }, 300);
  }


  render() {
    const completedExercises = this.props.upgradeRoutine, 
          allExercises = this.props.saveRoutine ? this.props.currentRoutine.exercises : this.props.originalRoutine.exercises;

    const updates = completedExercises ? completedExercises.map((value, index) => 
      <WorkoutUpdates key={'log-' + index + '-' + value} completedSet={value} allSets={allExercises} database={this.props.exercisesDatabase} notUpdating={this.props.cancelUpdate}/>
    ) : false;

    let contents = <div className="contents"></div>;

    if(this.props.runningStatus){
      contents = <div className="contents">
          <div className="modal-header">
            <div className="container">
              <p className="title">Terminer l'entraînement ?</p>
              <button className="closer" onClick={this.closeModal}>Fermer</button>
            </div>
          </div>
          <div className="modal-contents">
            <p>Votre entraînement est terminé ? Félicitations !</p>
            {this.props.changedRoutine ?  
              <div>
                <hr/>
                <p>Vous avez changé certains poids pour cet entrainement, souhaitez vous enregistrer ces modifications ? </p>
                <input type="checkbox" name="saveRoutine" value="yes" checked={this.props.saveRoutine ? true : false} onChange={this.props.routineUpdateToggle}/>
                <label onClick={this.props.routineUpdateToggle}>Enregistrer les modifications</label>
              </div>
            : false }
            {this.props.upgradeRoutine ?  
              <div>
                <hr/>
                <p>Vous avez atteint vos objectifs ! souhaitez-vous augmenter la difficulté de cet entrainement ?</p>
                {updates}
              </div>
            : false }
            <hr/>
            <button className="closer" onClick={this.props.writeRoutine}>Valider</button>
            <button className="closer" onClick={this.closeModal}>Annuler</button>
          </div>
        </div>
    }
    else{
      contents =  <div className="contents">
          <div className="modal-header">
            <div className="container">
              <p className="title">Bravo !</p>
            </div>
          </div>
          <div className="modal-contents">
            {this.props.saveRoutine || this.props.upgradeRoutine ? <p>Vos choix ont bien été enregistrés !</p> : false}
            <p>Nos vous redirigons vers le dashboard !</p>
          </div>
        </div>
    }

    return (
      <div className={"popin visible" + this.state.animate}>
        {contents}
      </div>
    )
  }
}

WorkoutExit.propTypes = {
  runningStatus: PropTypes.bool.isRequired,
} 

export default WorkoutExit;
