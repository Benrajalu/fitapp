import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Velocity from 'velocity-animate';

class AnimatedPanel extends Component {
  componentWillEnter (callback) {
      const element = ReactDOM.findDOMNode(this);
      Velocity(element, 'slideDown', { duration: 300 }).then(callback);
  }

  componentWillLeave (callback) {
      const element = ReactDOM.findDOMNode(this);
      Velocity(element, 'slideUp', { duration: 300 }).then(callback);
  }


  render() {
    return (
      <div className="animatedPanel">
        {this.props.children}
      </div>
    )
  }
}

export default AnimatedPanel;
