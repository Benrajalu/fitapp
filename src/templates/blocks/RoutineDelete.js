import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineLoader from '../blocks/InlineLoader';

class RoutineDelete extends Component {
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
      _this.props.modalCloser();
    }, 300);
  }

  render() {
    return (
      <div className={'popin overlay ' + this.state.visible}>
        <div className="modal-contents">
          {!this.props.killConfirmed ? (
            <div className="container">
              <div className="panel alert">
                <div className="panel-body">
                  <div className="icon">
                    <FontAwesomeIcon icon={['far', 'trash']} size="1x" />
                  </div>
                  <p>
                    Souhaitez vous effacer la routine{' '}
                    <strong>{this.props.name}</strong>&nbsp;?
                  </p>
                  <p className="caution">
                    Cette action est irrémédiable&nbsp;!
                  </p>
                  {this.props.deleting ? <InlineLoader /> : null}
                </div>
                {this.props.deleting ? null : (
                  <div className="buttons inline">
                    <button
                      className="btn ok"
                      onClick={this.props.deleteRoutine}>
                      Supprimer cette routine
                    </button>
                    <button className="btn" onClick={this.closeModal}>
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="panel alert">
                <div className="panel-body">
                  <p>
                    La routine <strong>{this.props.name}</strong> a été effacée
                    avec succès
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

RoutineDelete.propTypes = {
  name: PropTypes.string.isRequired
};

export default RoutineDelete;
