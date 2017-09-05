import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Timestamper extends Component {
  render() {
    const timestamp = new Date(this.props.timestamp),
          now = new Date(), 
          today = new Date(now.getFullYear(), now.getMonth(), now.getDate()), 
          yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);


    const workoutHour = timestamp.getHours() < 10 ? ('0' + timestamp.getHours()) : timestamp.getHours(),
          workoutMinutes = timestamp.getMinutes() < 10 ? ('0' + timestamp.getMinutes()) : timestamp.getMinutes();

    const workoutMonth = timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1,
          workoutDay = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(),
          workoutYear = timestamp.getFullYear(), 
          workoutString = workoutDay + '/' + workoutMonth + '/' + workoutYear;

    const todayMonth = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1,
          todayDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate(),
          todayYear = today.getFullYear(),
          todayString = todayDay + '/' + todayMonth + '/' + todayYear;

    const yesterdayMonth = yesterday.getMonth() + 1 < 10 ? '0' + (yesterday.getMonth() + 1) : yesterday.getMonth() + 1,
          yesterdayDay = yesterday.getDate() < 10 ? '0' + yesterday.getDate() : yesterday.getDate(),
          yesterdayYear = yesterday.getFullYear(),
          yesterdayString = yesterdayDay + '/' + yesterdayMonth + '/' + yesterdayYear;

    const timeSignature = ' à ' + workoutHour + ':' + workoutMinutes;

    let timezone = false;

    if(workoutString === todayString){
      timezone = "Aujourd'hui";
    }
    else if(workoutString === yesterdayString){
      timezone = "Hier";
    }
    else{
      timezone = workoutString;
    }

    const workoutTimeString = timezone + timeSignature;

    return (
      <p>{workoutTimeString}</p>
    )
  }
}

Timestamper.propTypes = {
  timestamp: PropTypes.number.isRequired
}

export default Timestamper;
