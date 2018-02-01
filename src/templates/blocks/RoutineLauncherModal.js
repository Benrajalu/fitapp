import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Routines from '../blocks/Routines';

import '../../styles/modals.css';

class RoutineLauncherModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideRoutines: false
    }
    this.applyOrder = this.applyOrder.bind(this);
  }

  applyOrder(value, event){
    event.preventDefault();
    const _this = this;
    this.setState({
      hideRoutines: true
    });
    setTimeout(() => {
      _this.setState({
        hideRoutines: false
      })
    }, 100);
    if (value !== "none"){
      this.setState({
        order:value
      });
    }
    else{
      this.setState({
        order:false
      });
    }
  }

  render() {
    const displayStatus = this.props.menu.workouts;
    let routines =[];
    if(this.props.routinesList.length > 0 && this.props.routinesList){
      routines = this.props.routinesList.sort((a, b) => {
        var c, d;
        switch(this.state.order){
          case 'low-use':
            c = new Date(a.lastPerformed);
            d = new Date(b.lastPerformed);
          break;

          case 'new': 
            c = new Date(a.dateCreated);
            d = new Date(b.dateCreated);
          break;

          case 'old':
            c = new Date(a.dateCreated);
            d = new Date(b.dateCreated);
          break;

          default:
            c = new Date(a.lastPerformed);
            d = new Date(b.lastPerformed);
        }

        if(this.state.order === 'low-use' || this.state.order === 'old'){
          return c<d ? -1 : c>d ? 1 : 0;
        }
        else{
          return c>d ? -1 : c<d ? 1 : 0;
        }

      });
    }

    return (
      <div className={"popin routines-collapse " + displayStatus}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Choisir une routine</p>
            <button className="closer" onClick={this.props.closeModal.bind(this)}><FontAwesomeIcon icon={['far', 'times']} size="1x" /></button>
          </div>
        </div>
        <div className="modal-options">
          <div className="container">
            <ul className="options">
              <li><button className={!this.state.order ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'none')}><span>Utilisation la plus récente</span></button></li>
              <li><button className={this.state.order && this.state.order === "low-use" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'low-use')}><span>Utilisation la moins récente</span></button></li>
              <li><button className={this.state.order && this.state.order === "new" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'new')}><span>Création la plus récente</span></button></li>
              <li><button className={this.state.order && this.state.order === "old" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'old')}><span>Création la moins récente</span></button></li>
            </ul>
          </div>
        </div>
        <div className="modal-contents">
          { this.props.routinesList.length !== 0 ?
            <div className="container">
              {this.state.hideRoutines ? false : <Routines list={routines} exercisesDatabase={this.props.exercises} user={this.props.user} closeModal={this.props.closeModal}/>}
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
  routinesList: PropTypes.array.isRequired,  
  exercises: PropTypes.array.isRequired,  
}

export default RoutineLauncherModal;
