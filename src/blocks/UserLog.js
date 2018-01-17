import React, { Component } from 'react';

import defaultAvatar from '../images/default-avatar.png';

class UserLog extends Component {
  render() {
    let avatar = this.props.user['profilePicture'] ? this.props.user['profilePicture'] : defaultAvatar;
    const style = {
      "backgroundImage": `url(${avatar})`,
      "backgroundSize":"cover",
      "width":"100%",
      "height":"250px"
    };

    return (
      <div className="UserLog">
        <div className="profile" style={style}>
          <div className="copy">
            <p>Hello, {this.props.user["displayName"]}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default UserLog;
