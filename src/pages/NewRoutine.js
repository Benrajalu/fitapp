import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RoutineMaker from '../blocks/RoutineMaker';

class NewRoutine extends Component {
  constructor(props) {
    super(props);
    this.handleFormPost = this.handleFormPost.bind(this);
  }

  handleFormPost(event, data) {
    event.preventDefault();
  }

  componentDidMount(){
    document.title = "FitApp. - Création d'un programme d'entraînement";
  }

  render() {
    return (
      <div className="NewRoutine">
        <div className="container">
          <div className="page-header">
            <Link to="/all-routines" title="Retour aux entraînements"><i className="fa fa-angle-left"></i></Link>
            <h1>Créer un programme</h1>
          </div>
        </div>
        
        <div className="container">
          <RoutineMaker postHandler={this.handleFormPost} />
        </div>

      </div>
    )
  }
}

export default NewRoutine;
