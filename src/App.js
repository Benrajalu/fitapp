import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { firebaseAuth, database } from './store/';

import { connect } from 'react-redux';
import { getLoading, removeLoading } from './actions/';
import { authenticateUser, resetUser } from './actions/UserActions';

// Navigation and loader
import AwareLoader from './templates/containers/AwareLoader.js';
import ModalFactory from './templates/factories/Modals.js';
import MenuContainer from './templates/containers/MenuContainer.js';

// Make sure page is on top when loaded
import ScrollToTop from './templates/blocks/ScrollToTop.js';

// Pages
import LoginContainer from './templates/containers/LoginContainer.js';
import Dashboard from './templates/pages/Dashboard.js';
import History from './templates/pages/History.js';
import AllRoutines from './templates/pages/AllRoutines.js';
import NewRoutine from './templates/pages/NewRoutine.js';
import EditRoutine from './templates/pages/EditRoutine.js';
import Settings from './templates/pages/Settings.js';
import Workout from './templates/pages/Workout.js';
import NoMatch from './templates/pages/NoMatch.js';

// Passing the state down through the connect down below
const mapStateToProps = state => {
  return {
    user: state.user,
    loading: state.loading,
    modals: state.modals,
    menu: state.menu,
    routines: state.routines
  };
};
// Passing the various actions needed at this stage from the store through the props
const mapDispatchToProps = dispatch => {
  return {
    getLoading: () => {
      dispatch(getLoading());
    },
    removeLoading: () => {
      dispatch(removeLoading());
    },
    authenticateUser: data => {
      dispatch(authenticateUser(data));
    },
    resetUser: () => {
      dispatch(resetUser());
    }
  };
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      userChecked: false
    };
    this.initiateDefaultUser = this.initiateDefaultUser.bind(this);
    this.setNewHeight = this.setNewHeight.bind(this);
  }

  authListener() {
    const _this = this;
    this.fireBaseListener = firebaseAuth.onAuthStateChanged(
      function(user) {
        if (user !== null && !_this.props.user.deleting) {
          const query = database.collection('users').doc(user.uid);
          query.onSnapshot(
            doc => {
              if (!doc.exists && !_this.props.user.deleting) {
                console.log("User doesn't exist");
                _this.initiateDefaultUser(user);
              } else if (doc.exists && !_this.props.user.deleting) {
                var rawdata = doc.data();
                rawdata.uid = user.uid;
                _this.props.authenticateUser(rawdata);
                _this.setState({
                  userChecked: true
                });
              } else {
                console.log('Proceeding with marked for deletion');
                database
                  .collection('users')
                  .doc(user.uid)
                  .delete()
                  .then(() => {
                    console.log('user data removed');
                    firebaseAuth.currentUser
                      .delete()
                      .then(() => {
                        console.log('user deleted');
                        firebaseAuth.signOut().then(() => {
                          _this.props.resetUser();
                        });
                      })
                      .catch(error => {
                        console.log('User already deleted');
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log("Can't logout");
                  });
              }
            },
            error => {
              console.log('User logged out');
              _this.props.resetUser();
            }
          );
        } else {
          console.log('not loggedin');

          _this.props.resetUser();
          _this.setState({
            userChecked: true
          });
        }
      },
      error => {
        console.log('done');
      }
    );
  }

  initiateDefaultUser(user) {
    console.log('initiation of defaults for new user');
    const query = database.collection('users'),
      email = user.email,
      name = user.displayName ? user.displayName : user.email.split('@')[0],
      photo = user.photoURL ? user.photoURL : false,
      settings = {
        baseBarbell: 20,
        availableWeights: [25, 20, 15, 10, 5, 2.5, 1.25, 1, 0.5, 0.25]
      },
      _this = this;

    query
      .doc(user.uid)
      .set({
        displayName: name,
        signinEmail: email,
        contactEmail: email,
        profilePicture: photo,
        settings: settings
      })
      .then(() => {
        let newQuery = database.collection('users').doc(user.uid);
        newQuery.get().then(doc => {
          var rawdata = doc.data();
          rawdata.uid = user.uid;
          _this.props.authenticateUser(rawdata);
          _this.setState({
            userChecked: true
          });
        });
      });
  }

  componentWillMount() {
    this.props.getLoading();
    this.authListener = this.authListener.bind(this);
    this.authListener();
  }

  compontentWillUnmout() {
    this.fireBaseListener && this.fireBaseListener();
    this.authListener = undefined;
  }

  componentDidMount() {
    this.setState({
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    });
  }

  setNewHeight() {
    this.setState({
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    });
  }

  render() {
    const _this = this;
    window.addEventListener('resize', () => {
      _this.setNewHeight();
    });
    return (
      <BrowserRouter>
        <ScrollToTop>
          <div
            className={
              'App ' +
              (this.props.user.uid ? 'logged-in' : 'logged-off') +
              (this.props.modals.status === 'opened' ? ' overlay' : ' ')
            }
            style={{ height: this.state.height }}>
            {this.props.user.uid ? (
              <div
                id="nav-zone"
                className={
                  'zone ' +
                  this.props.menu.layout +
                  (this.props.loading.overlay !== false ? ' overlay' : ' ')
                }>
                <MenuContainer />
              </div>
            ) : (
              false
            )}
            {this.state.userChecked ? (
              <div
                id="contents-zone"
                className={
                  'zone ' +
                  (this.props.loading.overlay !== false ? ' overlay' : ' ')
                }>
                <main
                  id="mainContents"
                  className={
                    this.props.menu.status === 'opened'
                      ? 'menuActive'
                      : undefined
                  }>
                  <div className="container-fluid no-padding">
                    {this.props.user.uid ? (
                      <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route path="/dasboard" component={Dashboard} />
                        <Route path="/all-routines" component={AllRoutines} />
                        <Route exact path="/history" component={History} />
                        <Route path="/new-routine" component={NewRoutine} />
                        <Route path="/edit/:id" component={EditRoutine} />
                        <Route path="/workout/:id" component={Workout} />
                        <Route path="/settings" component={Settings} />
                        <Redirect from="/login" to="/" />
                        <Route component={NoMatch} />
                      </Switch>
                    ) : (
                      <Switch>
                        <Route
                          exact
                          path="/login"
                          component={LoginContainer}
                          testHeight={this.state.height}
                        />
                        <Redirect from="/" to="/login" />
                        <Route component={NoMatch} />
                      </Switch>
                    )}
                  </div>
                </main>
              </div>
            ) : null}

            <AwareLoader loading="LOADING" />
            <ModalFactory />
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
