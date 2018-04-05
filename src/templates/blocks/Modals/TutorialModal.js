import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class TutorialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null,
      activeSlide: 0
    };
    this.closeModal = this.closeModal.bind(this);
    this.navigate = this.navigate.bind(this);
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

  navigate(index) {
    this.setState({
      activeSlide: index
    });
  }

  render() {
    const slides = [
      {
        title: 'Introduction',
        content: (
          <Fragment>
            <div className="splash large">
              <h1 className="logo">
                fit<strong>app</strong>
              </h1>
              <h2 className="card-title">Bienvenue !</h2>
            </div>
            <div className="content">
              <p>
                <strong>FitApp</strong> est un journal d'entraînement. Créez vos
                routines, suivez vos records et progressez !
              </p>
            </div>
          </Fragment>
        )
      },
      {
        title: 'Créer une routine',
        content: (
          <Fragment>
            <div className="splash">
              <h2 className="card-title">Créer une routine</h2>
            </div>
            <div className="content">
              <h3>Qu'est-ce qu'une routine ?</h3>
              <p>
                Une routine est une série d'exercices que vous souhaitez
                réaliser lors d'un entraînement. Vous êtes totalement libre de
                créer la routine qui vous convient, quand elle vous convient.
              </p>
              <p>
                De nombreux programmes d'entraînement reposent sur une
                alternance entre deux ou trois routines par semaines, fitapp a
                été créée avec cette philosophie en tête.
              </p>
            </div>
          </Fragment>
        )
      }
    ];

    return (
      <div className={'modal tutorialModal ' + this.state.visible}>
        <div className="timeline">
          <ul className="chapters">
            {slides.map((item, index) => {
              return (
                <li key={'navIndex-' + index}>
                  <button
                    onClick={this.navigate.bind(this, index)}
                    className={
                      index === this.state.activeSlide ? 'active' : null
                    }>
                    {item.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="cards">
          {slides.map((item, index) => {
            let currentClass = null;
            if (index === this.state.activeSlide) {
              currentClass = 'active';
            }
            if (index === this.state.activeSlide + 1) {
              currentClass = 'next';
            }
            if (index === this.state.activeSlide - 1) {
              currentClass = 'previous';
            }
            return (
              <div
                className={'card ' + currentClass}
                key={'cardIndex-' + index}>
                {item.content}
              </div>
            );
          })}
        </div>

        <div className="navigation">
          <button
            className="direction"
            disabled={this.state.activeSlide === 0}
            onClick={this.navigate.bind(
              this,
              this.state.activeSlide - 1 > 0 ? this.state.activeSlide - 1 : 0
            )}>
            <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Précedent
          </button>
          <button
            className="direction"
            disabled={this.state.activeSlide === slides.length - 1}
            onClick={this.navigate.bind(
              this,
              this.state.activeSlide + 1 > slides.length - 1
                ? this.state.activeSlide
                : this.state.activeSlide + 1
            )}>
            Suivant <FontAwesomeIcon icon={['fas', 'angle-right']} size="1x" />
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
