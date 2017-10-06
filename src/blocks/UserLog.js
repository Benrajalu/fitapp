import React, { Component } from 'react';
import { isLoggedIn, getUserInfo, userData } from '../utils/AuthService';
import defaultAvatar from '../images/default-avatar.png';

class UserLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    }
  }

  componentDidMount() {
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
  }

  render() {
    return (
      <div className="UserLog">
        <img src={this.props.user['profile-picture'] || this.state.profile.picture ? this.props.user['profile-picture'] || this.state.profile.picture : defaultAvatar } alt="" />
        <p>Hello, {this.props.user["display-name"]}</p>
      </div>
    )
  }
}

export default UserLog;
