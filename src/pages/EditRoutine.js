import React, { Component } from 'react';
import RoutineMaker from '../blocks/RoutineMaker';

import userData from '../data/users.json';

class EditRoutine extends Component {
  constructor(props) {
    super(props);
    this.handeleFormPost = this.handleFormPost.bind(this);

    this.state = {
      routineId: this.props.match ? this.props.match.params.id : undefined, 
      routine: false
    }
  }

  componentDidMount() {
    const realRoutine = userData[0].routines.filter(obj => obj.id === this.props.match.params.id )[0];
    this.setState({
      routine: realRoutine
    });
  }

  handleFormPost(event, data) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="EditRoutine">
        <div className="container">
          <div className="page-header">
            <h1>Modifier ce programme</h1>
          </div>
        </div>
        
        <RoutineMaker postHandler={this.handleFormPost} editRoutine={this.state.routine}/>

      </div>
    )
  }
}

export default EditRoutine;
