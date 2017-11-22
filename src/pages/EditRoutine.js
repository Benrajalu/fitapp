import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {firebaseAuth, database} from '../utils/fire';

import RoutineMaker from '../blocks/RoutineMaker';

class EditRoutine extends Component {
  constructor(props) {
    super(props);
    this.handeleFormPost = this.handleFormPost.bind(this);

    this.state = {
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"}, 
      routine: false,
      loading: true,
      mounted:false
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

  componentDidMount(){
    document.title = "FitApp. - Modification d'un programme";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }

  handleFormPost(event, data) {
    event.preventDefault();
  }

  render() {
    return (
      <div className={this.state.mounted ? "EditRoutine loaded" : "EditRoutine"}>
        <div className="container animation-introduction">
          <div className="page-header">
            <Link to="/all-routines" title="Retour aux entraînements"><i className="fa fa-angle-left"></i></Link>
            <h1>Modifier ce programme</h1>
          </div>
        </div>
        <div className="container animation-contents">
          {this.state.routine ? <RoutineMaker postHandler={this.handleFormPost} editRoutine={this.state.routine ? this.state.routine : "empty"} /> : <div className="container empty"><div className="inlineLoader"><p>Chargement de l'entraînement...</p></div></div>}
        </div>
      </div>
    )
  }
}

export default EditRoutine;
