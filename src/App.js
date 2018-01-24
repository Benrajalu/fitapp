import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import {firebaseAuth, database} from './store/';

import { connect } from 'react-redux';
import {getLoading, removeLoading} from './actions/';
import {authenticateUser, resetUser} from './actions/UserActions';

// Navigation and loader
import AwareLoader from "./templates/containers/AwareLoader.js"; 
import MenuContainer from "./templates/containers/MenuContainer.js"; 

// Pages
import LoginContainer from './templates/containers/LoginContainer.js';
import Dashboard from './templates/pages/Dashboard.js';
import NoMatch from './templates/pages/NoMatch.js';

import './styles/placeholder.css';

// Passing the state down through the connect down below
const mapStateToProps = state => {
  return{
    user: state.user, 
    loading: state.loading, 
    menu:state.menu
  }
};
// Passing the various actions needed at this stage from the store through the props
const mapDispatchToProps = dispatch => {
  return {
    getLoading: () => {
      dispatch(getLoading())
    },
    removeLoading: () => {
      dispatch(removeLoading())
    },
    authenticateUser: (data) => {
      dispatch(authenticateUser(data))
    }, 
    resetUser: () => {
      dispatch(resetUser())
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      userChecked: false
    };
    this.initiateDefaultUser = this.initiateDefaultUser.bind(this);
  }

  authListener(){
    const _this = this;
    this.fireBaseListener = firebaseAuth.onAuthStateChanged(function(user) {
      if(user !== null){
        _this.props.removeLoading();
        const query = database.collection('users').doc(user.uid);
        query.onSnapshot((doc) => {
          if(!doc.exists){
            console.log("User doesn't exist");
            _this.initiateDefaultUser(user);
          }
          else{
            var rawdata = doc.data();
            rawdata.uid = user.uid;
            _this.props.authenticateUser(rawdata);
            _this.setState({
              userChecked: true
            });
          }
        }, (error) => {
          console.log("User logged out");
        });
      }
      else{
        console.log("not loggedin");
        _this.setState({
          userChecked: true
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
        var rawdata = doc.data();
        rawdata.uid = user.uid;
        _this.props.authenticateUser(rawdata);
        _this.setState({
          userChecked: true
        });
      })
    });
  }

  componentWillMount() {
    this.props.getLoading();
    this.authListener = this.authListener.bind(this);
    this.authListener();
  }

  compontentWillUnmout(){
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  componentDidMount(){
    setTimeout(()=>{
      this.props.removeLoading();
    },300);
  }

  render() {
    return (
      <BrowserRouter>
        <div className={this.props.user.uid ? 'App logged-in' : 'App logged-off' }>
          {this.props.user.uid ? <div id="nav-zone" className="zone"><MenuContainer /></div> : false}
          {this.state.userChecked ?
            <div id="contents-zone" className="zone">
              <main id="mainContents" className={this.props.menu.status === "opened" ? "menuActive" : undefined}>
                <div className="container-fluid no-padding">
                {this.props.user.uid ? 
                  <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Redirect from="/login" to="/"/>
                    <Route component={NoMatch}/>
                  </Switch>
                :
                  <Switch>
                    <Route exact path="/login" component={LoginContainer}/>
                    <Redirect from="/" to="/login"/>
                    <Route component={NoMatch}/>
                  </Switch>
                }
                </div>
              </main>
            </div>
            :
            null
          }

          <AwareLoader loading="LOADING" />
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
