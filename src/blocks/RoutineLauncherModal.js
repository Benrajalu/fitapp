import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Routines from '../blocks/Routines';

import '../styles/modals.css';

class RoutineLauncherModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }
  closeModal() {
    // References the parent method for displaying a modal that's in Dashboard.js
    this.props.modalCloser();
  }

  render() {
    const displayStatus = this.props.shouldAppear;

    return (
      <div className={"routineLauncher popin " + displayStatus}>
        <div className="contents">
          Here will be routines
          <button className="closer" onClick={this.closeModal}>Close modal</button>
          { this.props.routinesList.length !== 0 ?
            <Routines list={this.props.routinesList} exercisesDatabase={this.props.exercises} />
          :
            <div className="alert alert-warning">Vous n'avez pas créé d'entrainement</div> 
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
