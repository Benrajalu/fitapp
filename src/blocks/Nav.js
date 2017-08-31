import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav>
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/all-routines">Mes entraînements</NavLink></li>
          <li><NavLink to="/history">Historique</NavLink></li>
          <li><NavLink to="/settings">Paramètres</NavLink></li>
          <li><a href="#">Déconnexion</a></li>
        </ul>
      </nav>
    )
  }
}

export default Nav;
