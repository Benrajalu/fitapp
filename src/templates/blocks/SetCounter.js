import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class SetCounter extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.addValue = this.addValue.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.state = {
      value:this.props.value
    }
  }

  handleChange(data, event){
    this.props.onCompletion([data, this.props.index]);
    this.setState({
      value:data
    })
  }

  addValue(){
    var currentValue = this.state.value < parseFloat(this.props.reps) ?  this.state.value + 1 : parseFloat(this.props.reps);
    this.props.onCompletion([currentValue, this.props.index]);
    this.setState({
      value:currentValue
    })
  }

  removeValue(){
    var currentValue = this.state.value > 0 ?  this.state.value - 1 : 0;
    this.props.onCompletion([currentValue, this.props.index]);
    this.setState({
      value:currentValue
    })
  }

  render() {
    return (
      <div className={this.state.value === parseInt(this.props.reps, 10) ? "set-counter completed" : "set-counter"} key={"set-" + this.props.index}>
        <div className="set-heading">
          <h4 className="title">Set {this.props.index + 1} | <strong>{this.props.value}/{this.props.reps} {this.props.repUnit}</strong></h4>
        </div>
        <div className="set-body">
          <button className="value-button" onClick={this.removeValue}><i className="fa fa-minus"></i></button>
          <Slider
            min={0}
            max={parseInt(this.props.reps, 10)}
            value={this.state.value}
            orientation="horizontal"
            onChange={this.handleChange}/>
          <button className="value-button" onClick={this.addValue}><i className="fa fa-plus"></i></button>
        </div>
      </div>
    )
  }
}

SetCounter.propTypes = {
  reps: PropTypes.number.isRequired
}

export default SetCounter;
