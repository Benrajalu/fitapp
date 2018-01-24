import React, { Component } from 'react';
import { Link } from 'react-router-dom';
/*import {firebaseAuth, database} from '../../utils/fire';*/

/*import RoutineLauncherModal from '../blocks/RoutineLauncherModal';
import WorkoutsLog from '../blocks/WorkoutsLog';
import RecordsLog from '../blocks/RecordsLog';
import WeekCounter from '../blocks/WeekCounter';*/


import '../../styles/Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {uid: "0"} 
    };
    /*this.displayModal = this.displayModal.bind(this);*/
  }

  /*logListener(){
    const _this = this, 
          user = this.state.user;

    this.fireLogListener = database.collection('users').doc(user.uid).collection('workoutLog').get().then((snapshot) => {
      const workoutLog = [];
      snapshot.forEach((doc) => {
        workoutLog.push(doc.data());
      });
      _this.setState({
        workoutList: workoutLog.length > 0 ? workoutLog : false
      });
    });
  }*/

  componentDidMount(){
    document.title = "FitApp. - Dashboard";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200);
  }

  /*displayModal(event) {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    })
  }*/


  render() {
    // Ensuring workouts and records are always in chronological order
    /*let workouts = [];
    if(this.state.workoutList.length > 0){
      workouts = this.state.workoutList.sort((a, b) => {
        var c = a.timestamp;
        var d = b.timestamp;
        return c>d ? -1 : c<d ? 1 : 0;
      });
    }*/

    return (
      <div className={this.state.mounted ? "Dashboard loaded" : "Dashboard"}>
        <h1>User is:</h1>
        <button className="button">Log off</button>
      </div>
    )
  }
}

export default Dashboard;
