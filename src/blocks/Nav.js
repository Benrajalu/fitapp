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
    firebaseAuth.signOut();
    this.props.resetUser();
  }


  render() {
    return (
      <nav className="navbar navbar-default" id="mainNav">
        <div className="container-fluid" id="navbarSupportedContent">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">Fit App</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><NavLink className="nav-link" to="/">Dashboard</NavLink></li>
              <li><NavLink className="nav-link" to="/all-routines">Mes entraînements</NavLink></li>
              <li><NavLink className="nav-link" to="/history">Historique</NavLink></li>
              <li><NavLink className="nav-link" to="/settings">Paramètres</NavLink></li>
              <li><button onClick={this.logOff} className="btn btn-danger">Déconnexion</button></li>
            </ul>
            <UserLog user={this.props.user} />
          </div>
        </div>
      </nav>
    )
  }
}

export default Nav;
