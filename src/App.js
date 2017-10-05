import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { requireAuth, login, isLoggedIn } from './utils/AuthService';

import Dashboard from './pages/Dashboard.js';
import Settings from './pages/Settings.js';
import History from './pages/History.js';
import AllRoutines from './pages/AllRoutines.js';
import EditRoutine from './pages/EditRoutine.js';
import NewRoutine from './pages/NewRoutine.js';
import Workout from './pages/Workout.js';
import NoMatch from './pages/NoMatch.js';
import Callback from './pages/Callback.js';
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
    const isLogged = isLoggedIn();
  
    this.setState({
      loggedIn: isLogged
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className={this.state.loggedIn ? 'App logged-in' : 'App logged-off' }>
          <MainNav />
          {(isLoggedIn()) ? 
            <main id="mainContents">
              <Switch>
                <Route exact path="/" component={Dashboard} onEnter={requireAuth} />
                <Route exact path="/settings" component={Settings} onEnter={requireAuth} />
                <Route exact path="/history" component={History} onEnter={requireAuth} />
                <Route exact path="/all-routines" component={AllRoutines} onEnter={requireAuth} />
                <Route path="/edit/:id" component={EditRoutine} onEnter={requireAuth} />
                <Route exact path="/new-routine" component={NewRoutine} onEnter={requireAuth} />
                <Route path="/workout/:id" component={Workout} onEnter={requireAuth} />
                <Redirect from="/workout" to="/all-routines"/>
                <Route exact path="/callback" component={Callback} />
                <Route component={NoMatch} />
              </Switch>
            </main>
          : 
            <main id="mainContents">
              <div className="container">
                <div className="col-md-12">
                  <div className="panel panel-alert">
                    <div className="panel-heading">
                      <h1 className="pnel-title">Vous n'êtes pas connecté</h1>
                    </div>
                    <div className="panel-body">
                      <p>Afin d'utiliser cette application, merci de vous connecter ou de créer un compte.</p>
                      <button className="btn btn-primary" onClick={() => login()}>Connexion</button>
                    </div>
                  </div>
                </div>
              </div>
              <Switch>
                <Route exact path="/callback" component={Callback} />
              </Switch>
            </main>
          }
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
