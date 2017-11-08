import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import UserLog from './UserLog';

import {firebaseAuth} from '../utils/fire';

import '../styles/nav.css';

import users from '../data/users.json';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.logOff = this.logOff.bind(this);
  }

  componentDidMount() {
    this.setState({user: users[0]});
  }

  logOff(event){
    event.preventDefault();
    firebaseAuth.signOut().then(() => {
      this.props.resetUser();
    });
  }


  render() {
    return (
      <nav id="mainNav" className={this.props.menuOpen ? "active" : "inactive"}>
        <div className="container-fluid navbar-header ">
          <div className="container">
            <Link to="/" className="navbar-brand" onClick={this.props.closeMenu}>Fit<strong>App.</strong></Link>
            <button className="menuToggle" title="Ouvrir le menu" onClick={this.props.toggleMenu}><i></i></button>
          </div>
        </div>

        <div className="navbar-collapse">
          <ul className="nav">
            <li><NavLink exact to="/" onClick={this.props.closeMenu}>Dashboard</NavLink></li>
            <li><NavLink to="/all-routines" onClick={this.props.closeMenu}>Mes entraînements</NavLink></li>
            <li><NavLink to="/history" onClick={this.props.closeMenu}>Historique</NavLink></li>
            <li><NavLink to="/settings" onClick={this.props.closeMenu}>Paramètres</NavLink></li>
          </ul>
          {this.props.user ? 
            <div className="userZone">
              <UserLog user={this.props.user} /> 
              <button onClick={this.logOff} className="btn btn-green">Déconnexion</button>
            </div>
            : 
            false
          }
        </div>
      </nav>
    )
  }
}

export default Nav;
