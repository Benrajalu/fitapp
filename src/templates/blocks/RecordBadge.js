import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Timestamper from '../blocks/Timestamper';
import '../../styles/RecordsLogs.css';

class RecordBadge extends Component {
  constructor(props){
    super(props);
    this.state = {
      animation:{
        perspective: "800px",
        transformOrigin: '50% 0%',
        marginBottom: -30,
        opacity: 0,
        transform: "rotateX(-70deg)"
      }
    }
  }
  componentDidMount(){
    const _this = this;
    setTimeout(() => {
      _this.setState({
        animation:{
          perspective: "800px",
          transformOrigin: '50% 100%',
          marginBottom: "0",
          opacity: 1,
          transform: "rotateX(-0deg)"
        }
      })
    }, this.props.delay);
  }
  render() {
    const data = this.props.contents;
    const exercisesDatabase = this.props.exercisesDatabase;
    const trueExercise = exercisesDatabase.filter(obj => obj.id === data.exerciseId )[0];


    return (
      <div className="records-card" style={this.state.animation}>
        <div className="value">
          <p>{data.record.split('kg')[0]}<span>kg</span></p>
        </div>
        <div className="description">
          <h3 className="title">{trueExercise.name}</h3>
          <Timestamper timestamp={this.props.contents.timestamp.toString().length !== 13 ? this.props.contents.timestamp * 1000 : this.props.contents.timestamp} />
        </div>
      </div>
    )
  }
}

RecordBadge.propTypes = {
  contents: PropTypes.object.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default RecordBadge;
