import React, { Component } from "react";
import PropTypes from "prop-types";
import { database } from "../../../store";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import InlineLoader from "../../blocks/InlineLoader";

class RoutineDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: null,
      routine: {}
    };
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    const realRoutine = this.props.routines.filter(
      obj => obj.id === this.props.target
    )[0];
    this.setState({
      routine: realRoutine
    });
    const _this = this;
    setTimeout(function() {
      _this.setState({
        visible: " visible"
      });
    }, 100);
  }

  deleteRoutine() {
    const _this = this;
    this.setState({
      deleting: true
    });
    database
      .collection("users")
      .doc(this.props.user.uid)
      .collection("routines")
      .doc(this.props.target)
      .delete()
      .then(() => {
        _this.setState(
          {
            deleting: false,
            killConfirmed: true
          },
          () => {
            setTimeout(() => {
              _this.closeModal();
              _this.props.refresh();
            }, 1500);
          }
        );
      });
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
      <div className={"modal " + this.state.visible}>
        <div className="modal-contents">
          {!this.state.killConfirmed ? (
            <div className="container padding-left">
              <div className="window">
                <div className="window-head">
                  <div className="title">
                    <h3>Supprimer la routine</h3>
                  </div>
                  <button className="close" onClick={this.closeModal}>
                    <FontAwesomeIcon icon={["fas", "times"]} size="1x" />
                  </button>
                </div>
                <div className="window-body">
                  <div className="icon">
                    <FontAwesomeIcon icon={["far", "trash"]} size="1x" />
                  </div>
                  <p>
                    Souhaitez vous effacer la routine{" "}
                    <strong>{this.state.routine.name}</strong>&nbsp;?
                  </p>
                  <p className="caution">
                    Cette action est irrémédiable&nbsp;!
                  </p>
                  {this.state.deleting ? <InlineLoader /> : null}
                </div>
                {this.state.deleting ? null : (
                  <div className="buttons inline">
                    <button
                      className="btn ok"
                      onClick={this.deleteRoutine.bind(this)}
                    >
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
              <div className="window">
                <div className="window-head">
                  <div className="title">
                    <h3>Routine supprimée</h3>
                  </div>
                </div>
                <div className="window-body">
                  <div className="icon">
                    <FontAwesomeIcon icon={["far", "check"]} size="1x" />
                  </div>
                  <p>
                    La routine <strong>{this.state.routine.name}</strong> a été
                    effacée avec succès
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
  target: PropTypes.string.isRequired
};

export default RoutineDelete;
