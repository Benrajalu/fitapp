import React, { Component } from 'react';
import { setIdToken, setAccessToken, isLoggedIn, getUserInfo, userData } from '../utils/AuthService';
import database from '../data/users.json';
import {Redirect} from 'react-router';

class Callback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile:false
    };
  }

  componentWillMount() {
    setAccessToken();
    setIdToken();
    const isLogged = isLoggedIn();
    
    if(isLogged){
      if (!userData) {
        getUserInfo((err, profile) => {
          this.setState({profile})
        });
      } else {
        this.setState({
          profile: userData
        })
      }
    }

    window.location.href = "/";
  }

  render() {
    var trueUser = database.filter((obj) => obj.id === this.state.profile.sub)[0];
    console.log(trueUser);
    return(
      <div>
        { this.state.profile ? <Redirect push to={{ pathname:'/'}} /> : false }
      </div>
    );
  }
}

export default Callback;