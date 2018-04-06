import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import UserLog from './UserLog';
import RoutineLauncherModal from './Overlays/RoutineLauncherModal';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { firebaseAuth } from '../../store/';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.logOff = this.logOff.bind(this);
  }

  logOff(event) {
    event.preventDefault();
    this.props.closeMenu();
    firebaseAuth.signOut().then(() => {
      this.props.resetUser();
    });
  }

  render() {
    return (
      <nav
        id="mainNav"
        className={this.props.menu.status === 'opened' ? 'active' : 'inactive'}>
        <div className="container-fluid navbar-header ">
          <div className="container">
            <h1>
              fit<strong>app</strong>
            </h1>
            <ul
              className={
                this.props.menu.workouts === 'closed'
                  ? 'list'
                  : 'list w-workouts'
              }>
              <li>
                <NavLink exact strict to="/" onClick={this.props.closeMenu}>
                  <FontAwesomeIcon icon={['fal', 'home']} size="1x" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/new-routine" onClick={this.props.closeMenu}>
                  <FontAwesomeIcon icon={['far', 'plus']} size="1x" />
                  <span>New</span>
                </NavLink>
              </li>
              <li className="middle">
                <button
                  className="trigger"
                  onClick={this.props.triggerWorkoutWindow}>
                  <FontAwesomeIcon icon={['far', 'play']} size="1x" />
                  <FontAwesomeIcon
                    icon={['far', 'times']}
                    size="1x"
                    className="alternate"
                  />
                </button>
              </li>
              <li>
                <NavLink to="/all-routines" onClick={this.props.closeMenu}>
                  <FontAwesomeIcon icon={['fal', 'file']} size="1x" />
                  <span>All</span>
                </NavLink>
              </li>
              <li>
                <button
                  className="menuToggle"
                  title="Ouvrir le menu"
                  onClick={this.props.toggleMenu}>
                  <FontAwesomeIcon icon={['fas', 'bars']} size="1x" />
                  <span>Menu</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="navbar-collapse">
          <div className="left">
            <ul className="nav">
              <li>
                <NavLink exact to="/" onClick={this.props.closeMenu}>
                  Dashboard <FontAwesomeIcon icon={['fas', 'home']} size="1x" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/all-routines" onClick={this.props.closeMenu}>
                  Mes entraînements{' '}
                  <FontAwesomeIcon icon={['fas', 'file']} size="1x" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/history" onClick={this.props.closeMenu}>
                  Historique{' '}
                  <FontAwesomeIcon icon={['fas', 'history']} size="1x" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings" onClick={this.props.closeMenu}>
                  Paramètres <FontAwesomeIcon icon={['fas', 'cog']} size="1x" />
                </NavLink>
              </li>
              <li>
                <button
                  onClick={this.props.toggleModal.bind(this, {
                    type: 'tutoriel'
                  })}>
                  Tutoriel{' '}
                  <FontAwesomeIcon
                    icon={['fas', 'question-circle']}
                    size="1x"
                  />
                </button>
              </li>
            </ul>
            {this.props.user ? (
              <div className="userZone">
                <UserLog user={this.props.user} logOff={this.logOff} />
              </div>
            ) : (
              false
            )}
          </div>
          <div className="right">
            <p>
              fit<strong>app</strong>
            </p>
            <button onClick={this.logOff} className="disconnect">
              <FontAwesomeIcon icon={['far', 'power-off']} size="1x" />{' '}
              Déconnexion
            </button>
            <button onClick={this.props.closeMenu} className="close">
              <FontAwesomeIcon icon={['far', 'times']} size="1x" /> Fermer
            </button>
          </div>
        </div>

        <RoutineLauncherModal
          routinesList={this.props.routines.routines}
          exercises={this.props.exercises.list}
          menu={this.props.menu}
          closeModal={this.props.triggerWorkoutWindow}
        />
      </nav>
    );
  }
}

export default Nav;
