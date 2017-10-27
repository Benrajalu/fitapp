import React, { Component } from 'react';
import {firebaseAuth, database} from '../utils/fire';

import RoutineMaker from '../blocks/RoutineMaker';

class EditRoutine extends Component {
  constructor(props) {
    super(props);
    this.handeleFormPost = this.handleFormPost.bind(this);

    this.state = {
      routine: false,
      loading: true
    }
  }

  componentDidMount() {
    const _this = this;
    firebaseAuth.onAuthStateChanged(function(user) {
      if (user) {
        const routineQuery = database.collection('users').doc(user.uid).collection('routines').doc(_this.props.match.params.id);
        routineQuery.get().then((doc) => {
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
        })
      } else {
        firebaseAuth.signOut();
      }
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
        {this.state.routine ? <RoutineMaker postHandler={this.handleFormPost} editRoutine={this.state.routine ? this.state.routine : "empty"} /> : <div className="container"><p>Chargement du programme...</p></div>}
      </div>
    )
  }
}

export default EditRoutine;
