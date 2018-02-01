import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import DashboardIntroContainer from '../containers/DashboardIntroContainer';
import WeeklyCounterContainer from '../containers/WeeklyCounterContainer';
import WorkoutsHistoryContainer from '../containers/WorkoutsHistoryContainer';
import RecordsHistoryContainer from '../containers/RecordsHistoryContainer';


import '../../styles/Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }


  componentDidMount(){
    document.title = "FitApp. - Dashboard";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200);
  }


  render() {
    return (
      <div className={this.state.mounted ? "Dashboard loaded" : "Dashboard"}>
        <p className="mainLogo">fit<strong>app</strong></p>
        <div className="container">
          <DashboardIntroContainer />
        </div>

        <div className="container">
          <div className="large-9 medium-8 columns workout-logs">
            <div className="header">
              <WeeklyCounterContainer />
              <NavLink to="/history" strict exact className="btn btn-default">Historique</NavLink>
            </div>
            <WorkoutsHistoryContainer limit="week" />
          </div>
          <div className="large-3 medium-4 columns records-logs">
            <p className="records-title">Vos records les plus récents</p>
            <RecordsHistoryContainer limit="5" />
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
