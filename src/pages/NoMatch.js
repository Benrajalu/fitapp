import React, { Component } from 'react';

import '../styles/NoMatch.css';

class NoMatch extends Component {
  constructor(props){
    super(props);
    this.state={
      mounted:false
    }
  }
  componentDidMount(){
    document.title = "FitApp. - Cette page n'existe pas !";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }

  render() {
    return (
      <div className={this.state.mounted ? 'NoMatch loaded' : 'NoMatch'}>
        <div className="container animation-introduction">
          <div className="page-header">
            <h1>404 - Cette page n'existe pas</h1>
          </div>
        </div>
      </div>
    )
  }
}

export default NoMatch;
