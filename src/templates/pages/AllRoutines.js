import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { watchRoutines } from '../../actions/RoutinesActions';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
//import {firebaseAuth, database} from '../utils/fire';

import Routines from '../blocks/Routines';

import '../../styles/AllRoutines.css';

const mapStateToProps = state => {
  return {
    user: state.user,
    loading: state.loading,
    menu: state.menu,
    routines: state.routines,
    exercises: state.exercises
  };
};

const mapDispatchToProps = dispatch => {
  return {
    watchRoutines: () => {
      dispatch(watchRoutines());
    }
  };
};

class AllRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      routinesList: this.props.routines.routines,
      exercises: this.props.exercises.list,
      user: { uid: '0' },
      mounted: false,
      order: false,
      showRoutines: true
    };
    this.applyOrder = this.applyOrder.bind(this);
  }

  applyOrder(value, event) {
    event.preventDefault();
    const _this = this;
    this.setState({
      showRoutines: false
    });
    if (value !== 'none') {
      this.setState({
        order: value
      });
      setTimeout(() => {
        _this.setState({
          showRoutines: true
        });
      }, 100);
    } else {
      this.setState({
        order: false
      });
      setTimeout(() => {
        _this.setState({
          showRoutines: true
        });
      }, 100);
    }
  }

  componentWillMount() {
    const user = this.props.user;
    user.id = user.uid;
    this.setState({
      user: user
    });
  }

  componentDidMount() {
    document.title = "FitApp. - Vos programmes d'entraînement";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted: true
      });
    }, 200);
  }

  render() {
    // Routines are sorted by most recently performed to never used ever
    let routines = [];
    if (
      this.props.routines.routines &&
      this.props.routines.routines.length &&
      this.props.routines.routines.length > 0
    ) {
      routines = this.props.routines.routines.sort((a, b) => {
        var c, d;
        switch (this.state.order) {
          case 'low-use':
            c = new Date(a.lastPerformed);
            d = new Date(b.lastPerformed);
            break;

          case 'new':
            c = new Date(a.dateCreated);
            d = new Date(b.dateCreated);
            break;

          case 'old':
            c = new Date(a.dateCreated);
            d = new Date(b.dateCreated);
            break;

          default:
            c = new Date(a.lastPerformed);
            d = new Date(b.lastPerformed);
        }

        if (this.state.order === 'low-use' || this.state.order === 'old') {
          return c < d ? -1 : c > d ? 1 : 0;
        } else {
          return c > d ? -1 : c < d ? 1 : 0;
        }
      });
    }

    return (
      <div
        className={this.state.mounted ? 'AllRoutines loaded' : 'AllRoutines'}>
        <div className="container-fluid page-intro">
          <div className="container">
            <Link to="/">
              <FontAwesomeIcon icon={['fas', 'angle-left']} size="1x" /> Retour
            </Link>
            <h1 className="page-header">Mes entraînements</h1>
          </div>
        </div>

        {this.state.loading ? (
          <div className="container empty animation-contents">
            <div className="inlineLoader">
              <p>Chargement de vos données</p>
            </div>
          </div>
        ) : (
          <div className="container animation-contents">
            <div className="medium-8 columns teasers-list">
              {routines.length > 0 ? (
                <div className="all-routines">
                  {this.state.showRoutines ? (
                    <Routines
                      rebuild={this.refreshRoutines}
                      list={routines}
                      exercisesDatabase={this.props.exercises.list}
                      editable="true"
                      user={this.props.user}
                      refresh={this.props.watchRoutines}
                    />
                  ) : null}
                </div>
              ) : (
                <div className="routine-detail empty">
                  <p>Vous n'avez pas créé d'entraînement !</p>
                  <Link to="/new-routine" className="btn btn-ghost">
                    Créer un entraînement
                  </Link>
                </div>
              )}
            </div>
            <div className="medium-4 columns teasers-controls">
              <Link className="btn" to="/new-routine">
                <i className="fa fa-plus" /> Créer un nouvel entraînement
              </Link>
              {routines.length > 0 ? (
                <div className="filters">
                  <div className="filter-title">
                    <FontAwesomeIcon icon={['fas', 'sliders-h']} size="1x" />
                    Classement
                  </div>
                  <div className="filter-options">
                    <ul className="options">
                      <li>
                        <button
                          className={
                            !this.state.order ? 'filter active' : 'filter'
                          }
                          onClick={this.applyOrder.bind(this, 'none')}>
                          <span>Utilisation la plus récente</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={
                            this.state.order && this.state.order === 'low-use'
                              ? 'filter active'
                              : 'filter'
                          }
                          onClick={this.applyOrder.bind(this, 'low-use')}>
                          <span>Utilisation la moins récente</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={
                            this.state.order && this.state.order === 'new'
                              ? 'filter active'
                              : 'filter'
                          }
                          onClick={this.applyOrder.bind(this, 'new')}>
                          <span>Création la plus récente</span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={
                            this.state.order && this.state.order === 'old'
                              ? 'filter active'
                              : 'filter'
                          }
                          onClick={this.applyOrder.bind(this, 'old')}>
                          <span>Création la moins récente</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllRoutines);
