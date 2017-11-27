import React, { Component } from 'react';

import defaultAvatar from '../images/default-avatar.png';

class UserLog extends Component {
  render() {
    return (
      <div className="UserLog">
        <img src={this.props.user['profilePicture'] ? this.props.user['profilePicture'] : defaultAvatar } alt="" />
        <p>Hello, {this.props.user["displayName"]}</p>
      </div>
    )
  }
}

export default UserLog;
