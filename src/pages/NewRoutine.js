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

  render() {
    return (
      <div className="NewRoutine">
        <div className="container">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard">&lt;</Link>
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
