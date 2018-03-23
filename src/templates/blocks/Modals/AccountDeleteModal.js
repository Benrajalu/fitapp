import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../../blocks/InlineLoader';
import { Redirect } from 'react-router';

import { firebaseAuth, fire, database } from '../../../store/';

class AccountDeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null,
      accountDelete: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.activateAccountDelete = this.activateAccountDelete.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.facebookID = this.facebookID.bind(this);
    this.googleID = this.googleID.bind(this);
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function() {
      _this.setState({
        visible: ' visible'
      });
    }, 100);

    let provider;
    switch (firebaseAuth.currentUser.providerData[0].providerId) {
      case 'google.com':
        provider = 'google';
        break;

      case 'password':
        provider = 'password';
        break;

      case 'facebook.com':
        provider = 'facebook';
        break;

      default:
        return false;
    }
    this.setState({
      provider: provider
    });
  }

  activateAccountDelete() {
    this.setState({
      accountDelete: !this.state.accountDelete
    });
  }

  handlePasswordInput(event) {
    let inputValue = event.target.value;
    if (inputValue.length > 0) {
      this.setState({
        password: inputValue,
        accountDelete: true
      });
    } else {
      this.setState({
        password: false,
        accountDelete: false
      });
    }
  }

  closeModal() {
    const _this = this;
    this.setState({
      visible: null
    });
    setTimeout(function() {
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeModal();
    }, 300);
  }

  facebookID() {
    var provider = new fire.auth.FacebookAuthProvider(),
      tokenId;
    const _this = this;
    fire
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token.
        tokenId = result.credential.accessToken;
        _this.setState({
          userToken: tokenId,
          accountDelete: true
        });
      });
  }

  googleID() {
    var provider = new fire.auth.GoogleAuthProvider(),
      tokenId;
    const _this = this;
    fire
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token.
        tokenId = result.credential.accessToken;
        _this.setState({
          userToken: tokenId,
          accountDelete: true
        });
      });
  }

  deleteAccount() {
    this.setState({
      inProgress: true
    });
    var credentials;
    const _this = this;

    switch (firebaseAuth.currentUser.providerData[0].providerId) {
      case 'google.com':
        credentials = fire.auth.GoogleAuthProvider.credential(
          null,
          this.state.userToken
        );
        break;

      case 'password':
        credentials = fire.auth.EmailAuthProvider.credential(
          firebaseAuth.currentUser.email,
          _this.state.password
        );
        break;

      case 'facebook.com':
        credentials = fire.auth.FacebookAuthProvider.credential(
          this.state.userToken
        );
        break;

      default:
        return false;
    }

    firebaseAuth.currentUser
      .reauthenticateWithCredential(credentials)
      .then(() => {
        _this.props.removeUser();
        database
          .collection('users')
          .doc(_this.props.user.uid)
          .set({
            delete: true
          })
          .then(() => {
            console.log('user marked for deletion');
            _this.props.closeModal();
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let deleteSecurity;

    switch (this.state.provider) {
      case 'password':
        deleteSecurity = (
          <p>
            <label>Veuillez re-entrer votre mot de passe pour confirmer</label>
            <input
              type="password"
              onChange={this.handlePasswordInput.bind(this)}
            />
          </p>
        );
        break;

      case 'facebook':
        deleteSecurity = (
          <p>
            <label>Veuillez vous ré-identifier avant de confirmer : </label>
            {this.state.userToken ? (
              <strong className="validation">Identification réussie</strong>
            ) : (
              <button
                className="btn facebook"
                onClick={this.facebookID.bind(this)}>
                Identification Facebook
              </button>
            )}
          </p>
        );
        break;

      case 'google':
        deleteSecurity = (
          <p>
            <label>Veuillez vous ré-identifier avant de confirmer : </label>
            {this.state.userToken ? (
              <strong className="validation">Identification réussie</strong>
            ) : (
              <button className="btn google" onClick={this.googleID.bind(this)}>
                Identification Google
              </button>
            )}
          </p>
        );
        break;

      default:
        deleteSecurity = (
          <p className="inlineCheckbox">
            <input
              type="checkbox"
              onChange={this.activateAccountDelete}
              id="security-checkbox"
            />{' '}
            <label htmlFor="security-checkbox">
              Je souhaite supprimer mon compte
            </label>
          </p>
        );
    }

    return (
      <div className={'modal ' + this.state.visible}>
        <div className="modal-contents">
          <div className="container padding-left">
            {!this.state.inProgress ? (
              <div className="window alert">
                <div className="window-head">
                  <div className="title">
                    <h3>Supprimer ce compte</h3>
                  </div>
                  <button className="close" onClick={this.closeModal}>
                    <FontAwesomeIcon icon={['fas', 'times']} size="1x" />
                  </button>
                </div>
                <div className="window-body">
                  <div className="icon">
                    <FontAwesomeIcon
                      icon={['far', 'exclamation-triangle']}
                      size="1x"
                    />
                  </div>
                  <p>
                    <strong>
                      Attention ! Cette action est irréversible et entraînera la
                      supression de votre compte et de toutes les informations
                      sauvegardées !
                    </strong>
                  </p>
                  {deleteSecurity}
                </div>
                <div className="buttons inline">
                  <button
                    className="btn ok"
                    onClick={this.deleteAccount.bind(this)}
                    disabled={this.state.accountDelete ? false : true}>
                    Supprimer mon compte
                  </button>
                  <button className="btn" onClick={this.closeModal}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="window alert">
                <div className="window-body">
                  <div className="icon">
                    <FontAwesomeIcon
                      icon={['far', 'exclamation-triangle']}
                      size="1x"
                    />
                  </div>
                  <p>
                    <strong>Suppression de vos données</strong>
                  </p>
                  <InlineLoader copy="Supression en cours" />
                </div>
              </div>
            )}
          </div>
        </div>
        {this.state.doneDeleting ? <Redirect to="/login" /> : null}
      </div>
    );
  }
}

AccountDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default AccountDeleteModal;
