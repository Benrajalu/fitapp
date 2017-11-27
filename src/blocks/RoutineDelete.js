import React, { Component } from 'react';
import PropTypes from 'prop-types';


class RoutineDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: " animate"
    }
    this.closeModal = this.closeModal.bind(this);
  }
  componentDidMount() {
    const _this = this;
    setTimeout(function(){
      _this.setState({
        animate: false
      })
    }, 100);
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
      <div className={"popin " + displayStatus + this.state.animate}>
        <div className="modal-header">
          <div className="container">
            <p className="title">Suppression d'un entraînement</p>
            <button className="closer" onClick={this.closeModal}>Fermer</button>
          </div>
        </div>
        <div className="modal-contents">
          {!this.props.killConfirmed ? 
            <div className="container">
              <div className="panel alert">
                <div className="panel-body">
                  <p><strong>Souhaitez vous effacer la routine {this.props.name} ?</strong></p>
                  <p>Cette action est irrémédiable !</p>
                  {this.props.deleting ? 
                    <div className="inlineLoader"><p>Suppression en cours</p></div>
                    :
                    <div className="buttons inline">
                      <button className="btn btn-danger" onClick={this.props.deleteRoutine}>Supprimer cette routine</button>&nbsp;
                      <button className="btn btn-default" onClick={this.closeModal}>Annuler</button>
                    </div>
                  }
                </div>
              </div>
            </div>
            : 
            <div className="container">
              <div className="panel alert">
                <div className="panel-body">
                  <p><strong>La routine {this.props.name} a été effacée avec succès</strong></p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

RoutineDelete.propTypes = {
  name: PropTypes.string.isRequired,
}

export default RoutineDelete;
