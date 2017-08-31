import React, { Component } from 'react';

import defaultAvatar from '../images/default-avatar.png';

class UserLog extends Component {
  render() {
    return (
      <div className="UserLog">
        <img src={this.props.user['profile-picture'] ? this.props.user['profile-picture'] : defaultAvatar } alt="" />
        <p>Hello, {this.props.user["display-name"]}</p>
      </div>
    )
  }
}

export default UserLog;
