import React, { Component } from 'react';
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
            <h1>Créer un programme</h1>
          </div>
        </div>
        
        <RoutineMaker postHandler={this.handleFormPost} />

      </div>
    )
  }
}

export default NewRoutine;
