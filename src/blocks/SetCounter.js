import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class SetCounter extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value:0
    }
  }

  handleChange(data, event){
    const max = parseInt(this.props.reps, 10);
    if(data === max){
      this.props.onCompletion([true, this.props.index]);
    }
    else{
      this.props.onCompletion([false, this.props.index]);
    }
    this.setState({
      value:data
    })
  }

  render() {
    return (
      <div className="panel panel-default" key={"set-" + this.props.index}>
        <div className="panel-heading text-center">
          <h4 className="panel-title">Set {this.props.index + 1} | {this.state.value}/{this.props.reps} reps</h4>
        </div>
        <div className="panel-body">
          <Slider
            min={0}
            max={parseInt(this.props.reps, 10)}
            value={this.state.value}
            orientation="horizontal"
            onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
}

SetCounter.propTypes = {
  reps: PropTypes.number.isRequired
}

export default SetCounter;
