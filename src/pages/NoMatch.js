import React, { Component } from 'react';

class NoMatch extends Component {
  componentDidMount(){
    document.title = "FitApp. - Cette page n'existe pas !";
  }

  render() {
    return (
      <div className="NoMatch">
        <div className="container">
          <div className="page-header">
            <h1>404 - Cette page n'existe pas</h1>
          </div>
        </div>
      </div>
    )
  }
}

export default NoMatch;
