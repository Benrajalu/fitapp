import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../styles/modals.css';

class AccountDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: " animate", 
      accountDelete: false
    }
    this.closeModal = this.closeModal.bind(this);
    this.activateAccountDelete = this.activateAccountDelete.bind(this);
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
  }

  activateAccountDelete(){
    this.setState({
      accountDelete: !this.state.accountDelete
    })
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
        <div className="modal-header alert">
          <div className="container">
            <p className="title">Supprimer votre compte</p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents">
          <div className="container">
            <div className="panel alert">
              <div className="panel-body">
                <p><strong>Attention ! Cette action est irréversible et entraînera la supression de votre compte et de toutes les informations sauvegardées !</strong></p>
                <p><input type="checkbox" onChange={this.activateAccountDelete} id="security-checkbox" /> <label htmlFor="security-checkbox">Je souhaite supprimer mon compte</label></p>
                <div className="buttons">
                  <button className="btn btn-green" onClick={this.closeModal}>Annuler</button>
                  <button className="btn btn-danger" onClick={this.props.deleteAccount} disabled={this.state.accountDelete ? false : true}>Supprimer mon compte</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AccountDeleteModal.propTypes = {
  shouldAppear: PropTypes.string.isRequired
}

export default AccountDeleteModal;
