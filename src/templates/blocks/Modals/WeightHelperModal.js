import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BarbellLoader from '../../blocks/BarbellLoader';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import uuid from 'uuid';

class WeightHelperModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.moveSlider = this.moveSlider.bind(this);
    this.activeWindow = this.activeWindow.bind(this);
    this.state = {
      visible: null,
      currentIndex: 0,
      activeWindow: this.props.targetWindow
    };
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

  moveSlider(direction) {
    if (direction === 'next') {
      this.setState({
        currentIndex:
          this.state.currentIndex < 4 ? this.state.currentIndex + 1 : 4
      });
    } else {
      this.setState({
        currentIndex:
          this.state.currentIndex > 0 ? this.state.currentIndex - 1 : 0
      });
    }
  }

  activeWindow(window) {
    this.setState({
      activeWindow: window
    });
  }

  componentDidMount() {
    const _this = this;
    this.setState({
      warmup: this.props.targetWindow === 'warmup'
    });
    setTimeout(function() {
      _this.setState({
        visible: ' visible'
      });
    }, 100);
  }

  render() {
    const repCeil = this.props.maxReps ? this.props.maxReps : 1,
      handicap = this.props.weight ? parseFloat(this.props.weight) : 1,
      isBarebell = this.props.type === 'barbell' ? true : false;

    // Check if the handicap is above the base barbell weight. If it's not, then all séries of the warmup are basically empty barbells
    let lowHandicap = false;
    if (isBarebell) {
      lowHandicap =
        parseFloat(handicap) <= parseFloat(this.props.settings.baseBarbell)
          ? true
          : false;
    }

    // initialiszing warmup array of "slides"
    let slides = [],
      indexes = [
        this.props.settings.baseBarbell + 'kg',
        this.props.settings.baseBarbell + 'kg'
      ];

    // Slide 1, 2
    slides.push(
      <div className={isBarebell ? 'slide' : 'slide no-barbell'}>
        <p>
          {repCeil} x{' '}
          {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg'}
        </p>
        {isBarebell ? (
          <BarbellLoader
            settings={this.props.settings}
            weight={parseFloat(this.props.settings.baseBarbell)}
          />
        ) : (
          false
        )}
      </div>
    );
    slides.push(
      <div className={isBarebell ? 'slide' : 'slide no-barbell'}>
        <p>
          {repCeil} x{' '}
          {isBarebell ? this.props.settings.baseBarbell + 'kg' : '5kg'}
        </p>
        {isBarebell ? (
          <BarbellLoader
            settings={this.props.settings}
            weight={parseFloat(this.props.settings.baseBarbell)}
          />
        ) : (
          false
        )}
      </div>
    );

    // Slides 3 to 5
    if (isBarebell && lowHandicap) {
      let x = 3;
      for (x; x < 6; x++) {
        slides.push(
          <div className="slide">
            <p>
              {repCeil} x {this.props.settings.baseBarbell + 'kg'}
            </p>
            <BarbellLoader
              settings={this.props.settings}
              weight={parseFloat(this.props.settings.baseBarbell)}
            />
          </div>
        );
        indexes.push(this.props.settings.baseBarbell + 'kg');
      }
    } else if (isBarebell) {
      const steps = [40, 60, 80];
      steps.map(value => {
        const baseBarbell = parseInt(this.props.settings.baseBarbell, 10);
        const slideValue =
          handicap * value / 100 > baseBarbell
            ? handicap * value / 100
            : baseBarbell;
        slides.push(
          <div className="slide">
            <p>
              {repCeil} x {Math.floor(slideValue / 5) * 5 + 'kg'}
            </p>
            {isBarebell ? (
              <BarbellLoader
                settings={this.props.settings}
                weight={Math.floor(slideValue / 5) * 5}
              />
            ) : (
              false
            )}
          </div>
        );
        indexes.push(Math.floor(slideValue / 5) * 5 + 'kg');
        return slides;
      });
    } else {
      const steps = [40, 60, 80];

      steps.map(value => {
        const slideValue =
          handicap * value / 100 > 5 ? handicap * value / 100 : 5;
        slides.push(
          <div className="slide no-barbell">
            <p>
              {repCeil} x {Math.floor(slideValue) + 'kg'}
            </p>
          </div>
        );
        indexes.push(Math.floor(slideValue / 5) * 5 + 'kg');

        return slides;
      });
    }

    const warmupSlides = slides.map((value, index) => (
      <div
        className={
          index === this.state.currentIndex
            ? 'warmup-content visible'
            : 'warmup-content  hidden'
        }
        key={'slide-' + uuid.v1()}>
        {value}
      </div>
    ));

    const warmupSequences = indexes.map((value, index) => {
      let status;
      if (index === this.state.currentIndex) {
        status = 'active';
      } else if (index < this.state.currentIndex) {
        status = 'done';
      } else {
        status = null;
      }
      return (
        <div className={'index ' + status} key={'index-' + index}>
          <h3>{index + 1}/5</h3>
          <p>{value}</p>
        </div>
      );
    });

    return (
      <div className={'modal ' + this.state.visible}>
        <div className="modal-contents">
          <div className="container padding-left">
            <div className="window">
              <div className="window-head">
                {isBarebell ? (
                  <button
                    className="switch"
                    onClick={this.activeWindow.bind(
                      this,
                      this.state.activeWindow === 'warmup'
                        ? 'loadout'
                        : 'warmup'
                    )}>
                    <FontAwesomeIcon icon={['far', 'exchange']} size="1x" />
                  </button>
                ) : null}
                <div className="title">
                  <h3>
                    {this.state.activeWindow === 'warmup'
                      ? 'Échauffement'
                      : 'Barre finale'}
                  </h3>
                </div>
                <button className="close" onClick={this.closeModal}>
                  <FontAwesomeIcon icon={['fas', 'times']} size="1x" />
                </button>
              </div>
              <div className="window-body no-padding">
                <div
                  className={
                    isBarebell ? 'panel warmup' : 'panel warmup no-barbell'
                  }>
                  <div className="tabs-zone">
                    <div
                      className={
                        this.state.activeWindow === 'warmup'
                          ? 'panel-tab active'
                          : 'panel-tab'
                      }>
                      <div className="panel-heading">
                        <p className="title">{this.props.name}</p>
                      </div>
                      <div className="panel-sub">{warmupSequences}</div>
                      <div className="panel-body">{warmupSlides}</div>
                      <div className="panel-footer">
                        {this.state.currentIndex === 0 ? (
                          <button disabled="true">
                            <FontAwesomeIcon
                              icon={['fas', 'angle-left']}
                              size="1x"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={this.moveSlider.bind(this, 'previous')}>
                            <FontAwesomeIcon
                              icon={['fas', 'angle-left']}
                              size="1x"
                            />
                          </button>
                        )}
                        {isBarebell &&
                        this.state.currentIndex === indexes.length - 1 ? (
                          <button
                            onClick={this.activeWindow.bind(this, 'loadout')}>
                            Barre finale
                          </button>
                        ) : (
                          false
                        )}
                        {this.state.currentIndex === indexes.length - 1 &&
                        !isBarebell ? (
                          <button disabled="disabled">
                            <FontAwesomeIcon
                              icon={['fas', 'angle-right']}
                              size="1x"
                            />
                          </button>
                        ) : (
                          false
                        )}
                        {this.state.currentIndex < indexes.length - 1 ? (
                          <button onClick={this.moveSlider.bind(this, 'next')}>
                            <FontAwesomeIcon
                              icon={['fas', 'angle-right']}
                              size="1x"
                            />
                          </button>
                        ) : (
                          false
                        )}
                      </div>
                    </div>
                    {isBarebell ? (
                      <div
                        className={
                          this.state.activeWindow === 'loadout'
                            ? 'panel-tab active'
                            : 'panel-tab'
                        }>
                        <div className="panel-heading">
                          <p className="title">{this.props.name}</p>
                        </div>
                        <div className="panel-body">
                          <div className="warmup-content visible">
                            <div className="slide">
                              <p>
                                {repCeil} x {handicap}kg
                              </p>
                              <BarbellLoader
                                settings={this.props.settings}
                                weight={parseFloat(handicap)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WeightHelperModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  targetWindow: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  maxReps: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired
};

export default WeightHelperModal;
