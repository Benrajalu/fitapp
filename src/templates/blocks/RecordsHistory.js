import React, { Component } from 'react';
import RecordBadge from '../blocks/RecordBadge';

class RecordsHistory extends Component {
  render() {
    // Order the workouts chronologically
    let displayRecords = [];

    const records = this.props.records.sort((a, b) => {
      var c = a.timestamp;
      var d = b.timestamp;
      return c > d ? -1 : c < d ? 1 : 0;
    });

    // Output items according to limits on component
    if (this.props.limit) {
      // Building the filter here
      displayRecords = records.slice(0, parseFloat(this.props.limit));
    } else {
      displayRecords = records;
    }

    const output = displayRecords.map((value, index) => (
      <RecordBadge
        key={value.id}
        contents={value}
        exercisesDatabase={this.props.exercisesDatabase}
        delay={index * 100}
      />
    ));

    return (
      <div className="workout-logs-list">
        {displayRecords.length > 0 ? (
          output
        ) : (
          <div className="empty-record">
            <p>Aucun record enregistré</p>
          </div>
        )}
      </div>
    );
  }
}

export default RecordsHistory;
