import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BarbellLoader from '../blocks/BarbellLoader';

import '../styles/weightLoader.css';

class WeightHelper extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      animate: " animate" 
    } 
  }
  closeModal() {
    const _this = this;
    this.setState({
      animate: " animate"
    });
    setTimeout(function(){
      // References the parent method for displaying a modal that's in Dashboard.js
      _this.props.closeModal();
    }, 300);
  }
  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
  }

  render() {
    const handicap = parseFloat(this.props.weight);
    const displayStatus = this.props.shouldAppear;

    return (
      <div className={"popin " + displayStatus + this.state.animate}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Répartition du poids</p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents">
          <BarbellLoader settings={this.props.settings} weight={handicap} />
        </div>
      </div>
    )
  }
}

WeightHelper.propTypes = {
  shouldAppear: PropTypes.string.isRequired,
}

export default WeightHelper;
