import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from './pages/Dashboard.js';
import Settings from './pages/Settings.js';
import History from './pages/History.js';
import AllRoutines from './pages/AllRoutines.js';
import NewRoutine from './pages/NewRoutine.js';
import Workout from './pages/Workout.js';
import NoMatch from './pages/NoMatch.js';
import Nav from './blocks/Nav.js';

import './styles/placeholder.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Nav />
          <main>
            <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route exact path="/settings" component={Settings}/>
              <Route exact path="/history" component={History}/>
              <Route exact path="/all-routines" component={AllRoutines}/>
              <Redirect from="/workout" to="/all-routines"/>
              <Route exact path="/new-routine" component={NewRoutine}/>
              <Route path="/workout/:id" component={Workout}/>
              <Route component={NoMatch}/>
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
