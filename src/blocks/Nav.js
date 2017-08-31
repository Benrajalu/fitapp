import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import UserLog from './UserLog';

import '../styles/nav.css';

import users from '../data/users.json';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    this.setState({user: users[0]});
  }


  render() {
    return (
      <nav id="mainNav">
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/all-routines">Mes entraînements</NavLink></li>
          <li><NavLink to="/history">Historique</NavLink></li>
          <li><NavLink to="/settings">Paramètres</NavLink></li>
          <li>Déconnexion</li>
        </ul>

        <UserLog user={this.state.user} />
      </nav>
    )
  }
}

export default Nav;
