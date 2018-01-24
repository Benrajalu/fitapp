import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Routines from '../blocks/Routines';

import '../styles/modals.css';

class RoutineLauncherModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: " animate"
    }
    this.closeModal = this.closeModal.bind(this);
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
      _this.props.modalCloser();
    }, 300);
  }

  render() {
    const displayStatus = this.props.shouldAppear;

    return (
      <div className={"routineLauncher popin " + displayStatus + this.state.animate}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Choisissez un entraînement</p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents">
          { this.props.routinesList.length !== 0 ?
            <div className="container">
              <Routines list={this.props.routinesList} exercisesDatabase={this.props.exercises} />
            </div>
          :
            <div className="container">
              <div className="routine-detail empty">
                <p>Vous n'avez pas créé d'entraînement !</p>
                <Link to="/new-routine" className="btn btn-green">Créer un entraînement</Link>
              </div> 
            </div>
          }
        </div>
      </div>
    )
  }
}

RoutineLauncherModal.propTypes = {
  shouldAppear: PropTypes.string.isRequired,  
  routinesList: PropTypes.array.isRequired,  
  exercises: PropTypes.array.isRequired,  
}

export default RoutineLauncherModal;
