import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RoutineDetail from '../blocks/RoutineDetail';

class Routines extends Component {
  render() {
    const routineList = this.props.list;
    const exercisesDatabase = this.props.exercisesDatabase;
    const routineItems = routineList.map((value) => 
      <RoutineDetail key={value.id} contents={value} exercisesDatabase={exercisesDatabase} editable={this.props.editable} user={this.props.user}/>
    );

    return (
      <div className="Routines">
        {routineItems}
      </div>
    )
  }
}

Routines.propTypes = {
  list: PropTypes.array.isRequired,
  exercisesDatabase: PropTypes.array.isRequired
}

export default Routines;
