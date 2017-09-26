import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from './pages/Dashboard.js';
import Settings from './pages/Settings.js';
import History from './pages/History.js';
import AllRoutines from './pages/AllRoutines.js';
import EditRoutine from './pages/EditRoutine.js';
import NewRoutine from './pages/NewRoutine.js';
import Workout from './pages/Workout.js';
import NoMatch from './pages/NoMatch.js';
import MainNav from './blocks/Nav.js';

import './styles/placeholder.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    var scope = this;
    setTimeout(function(){
      // Mucking-up a log-in
      scope.setState({loggedIn: true});
    },400);
  }

  render() {
    return (
      <BrowserRouter>
        <div className={this.state.loggedIn ? 'App logged-in' : 'App logged-off' }>
          <MainNav />
          <main id="mainContents">
            <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route exact path="/settings" component={Settings}/>
              <Route exact path="/history" component={History}/>
              <Route exact path="/all-routines" component={AllRoutines}/>
              <Route path="/edit/:id" component={EditRoutine}/>
              <Route exact path="/new-routine" component={NewRoutine}/>
              <Route path="/workout/:id" component={Workout}/>
              <Redirect from="/workout" to="/all-routines"/>
              <Route component={NoMatch}/>
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
