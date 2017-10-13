import React, { Component } from 'react';
import PropTypes from 'prop-types';

class WeekCounter extends Component {
  render() {
    const workoutsList = this.props.list;
    const now = new Date(), 
          currentDay = now.getDay() === 0 ? 7 : now.getDay(), 
          offset = currentDay;

    let registeredWorkouts = 0;

    workoutsList.map((value) => {
      if(value.timestamp && value.timestamp.toString().length !== 13){
        value.timestamp = value.timestamp * 1000;
      }

      // Get the date of the current workout being looped on
      const workoutTimestamp = new Date(value.timestamp);

      // Asset its distance with today and correct any timezone offset it may have suffered
      let distance = (workoutTimestamp - now) / 1000 / 60 / 60 / 24;
          distance = distance - (workoutTimestamp.getTimezoneOffset() - now.getTimezoneOffset()) / (60 * 24);

      // If the distance is smaller or equal to the offset related to the current week, add it to the total 
      if(distance*-1 <= offset){
        return registeredWorkouts += 1;
      }
      else{
        return false
      }
    });

    return (
      <div className="WeekCounter">
        <p><span className="badge">{registeredWorkouts}</span> <strong>Entraînement{registeredWorkouts > 1 ? 's' : ''} cette semaine</strong></p>
      </div>
    )
  }
}

WeekCounter.propTypes = {
  list: PropTypes.array.isRequired
}

export default WeekCounter;
