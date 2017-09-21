import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BarbellLoader from '../blocks/BarbellLoader';

class WeightHelper extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }
  closeModal() {
    // References the parent method for displaying a modal that's in Dashboard.js
    this.props.closeModal();
  }

  render() {
    const handicap = parseFloat(this.props.weight);
    const displayStatus = this.props.shouldAppear;

    return (
      <div className={"routineLauncher popin " + displayStatus}>
        <div className="contents">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Répartition du poids</h3>
              <button className="closer" onClick={this.closeModal}>Close modal</button>
            </div>
            <div className="panel-body">
              <BarbellLoader settings={this.props.settings} weight={handicap} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

WeightHelper.propTypes = {
  shouldAppear: PropTypes.string.isRequired,
}

export default WeightHelper;
