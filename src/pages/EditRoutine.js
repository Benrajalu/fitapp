import React, { Component } from 'react';
import {firebaseAuth, database} from '../utils/fire';

import RoutineMaker from '../blocks/RoutineMaker';

class EditRoutine extends Component {
  constructor(props) {
    super(props);
    this.handeleFormPost = this.handleFormPost.bind(this);

    this.state = {
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"}, 
      routine: false,
      loading: true
    }
  }

  routineListener(){
    const _this = this, 
          user = this.state.user, 
          routine = this.props.match.params.id;

    this.fireRoutineListener = database.collection('users').doc(user.uid).collection('routines').doc(routine).get().then((doc) => {
      if(doc.exists){
        const realRoutine = doc.data();
        _this.setState({
          routine: realRoutine, 
          loading: false
        });
      }
      else{
        _this.setState({
          routine: false, 
          loading: false
        });
      }
    });
  }

  componentWillMount() {
    // Binding the listeners created above to this component
    this.routineListener = this.routineListener.bind(this);
    this.routineListener();
  }

  compontentWillUnmout(){
    // Removing the bindings and stopping the events from poluting the state
    this.routinesListener = undefined;
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
        {this.state.routine ? <RoutineMaker postHandler={this.handleFormPost} editRoutine={this.state.routine ? this.state.routine : "empty"} /> : <div className="container"><p>Chargement du programme...</p></div>}
      </div>
    )
  }
}

export default EditRoutine;
