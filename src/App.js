import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import {firebaseAuth, database} from './utils/fire';

import Loader from "./blocks/Loader.js"; 
import Dashboard from './pages/Dashboard.js';
import Settings from './pages/Settings.js';
import History from './pages/History.js';
import AllRoutines from './pages/AllRoutines.js';
import EditRoutine from './pages/EditRoutine.js';
import NewRoutine from './pages/NewRoutine.js';
import Workout from './pages/Workout.js';
import Login from './pages/Login.js';
import NoMatch from './pages/NoMatch.js';
import MainNav from './blocks/Nav.js';

import './styles/placeholder.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: false,
      loading:true,
      loggedIn: false, 
      user: false
    };
    this.initiateDefaultUser = this.initiateDefaultUser.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  toggleMenu(event){
    event.preventDefault();
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  closeMenu(event){
    this.setState({
      menuOpen: false
    });
  }

  authListener(){
    const _this = this;
    this.fireBaseListener = firebaseAuth.onAuthStateChanged(function(user) {
      if(user){
        const query = database.collection('users').doc(user.uid);
        query.onSnapshot((doc) => {
          if(!doc.exists){
            _this.initiateDefaultUser(user);
          }
          else{
            _this.setState({
              user: doc.data(), 
              loggedIn: true, 
              loading: false
            })
          }
        });
      }
      else{
        _this.setState({
          loggedIn: false, 
          loading: false
        });
      }
    });
  }

  initiateDefaultUser(user){
    const query = database.collection('users'), 
          email = user.email, 
          name = user.displayName ? user.displayName : user.email.split('@')[0], 
          photo = user.photoURL ? user.photoURL : false, 
          settings = {
            baseBarbell : 20, 
            availableWeights : [25,20,15,10,5,2.5,1.25,1,0.5,0.25]
          },
          _this = this;

    query.doc(user.uid).set({
      displayName: name, 
      signinEmail: email,
      contactEmail: email,
      profilePicture: photo,
      settings: settings
    }).then(() => {
      let newQuery = database.collection('users').doc(user.uid);
      newQuery.get().then((doc) => {
        _this.setState({
          user: doc.data(), 
          loggedIn: true, 
          loading: false
        })
      })
    });
  }

  resetUser(){
    this.setState({
      user: false, 
      loggedIn: false
    })
  }

  componentWillMount() {
    this.authListener = this.authListener.bind(this);
    this.authListener();
  }

  compontentWillUnmout(){
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  render() {
    return (
      <BrowserRouter>
        <div className={this.state.loggedIn ? 'App logged-in' : 'App logged-off' }>
            {this.state.loggedIn ? <div id="nav-zone" className="zone"><MainNav user={this.state.user}  resetUser={this.resetUser} toggleMenu={this.toggleMenu} closeMenu={this.closeMenu} menuOpen={this.state.menuOpen} /></div> : false}
          <div id="contents-zone" className="zone">
            {this.state.loading ? <Loader /> :
              <main id="mainContents" className={this.state.menuOpen && this.state.loggedIn ? "menuActive" : undefined}>
                <div className="container-fluid no-padding">
                {this.state.loggedIn ? 
                  <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/settings" component={Settings}/>
                    <Route exact path="/history" component={History}/>
                    <Route exact path="/all-routines" component={AllRoutines}/>
                    <Route path="/edit/:id" component={EditRoutine}/>
                    <Route exact path="/new-routine" component={NewRoutine}/>
                    <Route path="/workout/:id" component={Workout}/>
                    <Redirect from="/workout" to="/all-routines"/>
                    <Redirect from="/login" to="/"/>
                    <Route component={NoMatch}/>
                  </Switch>
                :
                  <Switch>
                    <Route exact path="/login" component={Login}/>
                    <Redirect from="/" to="/login"/>
                    <Route component={NoMatch}/>
                  </Switch>
                }
                </div>
              </main>
            }
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
