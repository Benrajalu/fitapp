import React, { Component } from 'react';

class Routines extends Component {
  render() {
    const routineList = this.props.list;
    const routineItems = routineList.map((value) => 
      <li key={value.id} className="routine-card">{value.name}</li>
    );

    return (
      <ul className="Routines">
        {routineItems}
      </ul>
    )
  }
}

export default Routines;
