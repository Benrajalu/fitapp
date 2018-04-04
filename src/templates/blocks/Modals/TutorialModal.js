import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class TutorialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null
    };
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const _this = this;
    setTimeout(function() {
      _this.setState({
        visible: ' visible'
      });
    }, 100);
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

  render() {
    return (
      <div className={'modal tutorialModal ' + this.state.visible}>
        <div className="timeline">
          <ul className="chapters">
            <li>
              <a href="#" className="active">
                Introduction
              </a>
            </li>
            <li>
              <a href="#">Routines</a>
            </li>
            <li>
              <a href="#">Entraînement</a>
            </li>
            <li>
              <a href="#">Paramètres</a>
            </li>
            <li>
              <a href="#">Historique</a>
            </li>
          </ul>
        </div>
        <div className="cards">
          <div className="card">
            <h2 className="card-title">Bienvenue</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
              tempora veniam facere assumenda accusantium cupiditate eaque, fuga
              neque saepe, hic deleniti enim nesciunt aut sunt porro ipsa
              distinctio vero, a.
            </p>
          </div>
        </div>

        <div className="navigation">
          <button className="direction">
            <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" />
          </button>
          <button className="direction">
            <FontAwesomeIcon icon={['fas', 'angle-right']} size="1x" />
          </button>
          <button className="close" onClick={this.closeModal}>
            Fermer le tutoriel
          </button>
        </div>
      </div>
    );
  }
}

TutorialModal.propTypes = {
  closeModal: PropTypes.func.isRequired
};

export default TutorialModal;
