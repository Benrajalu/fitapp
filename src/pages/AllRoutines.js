import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {firebaseAuth, database} from '../utils/fire';

import Routines from '../blocks/Routines';

import '../styles/AllRoutines.css';


class AllRoutines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      routinesList:[], 
      exercises: [], 
      user: firebaseAuth.currentUser ? firebaseAuth.currentUser : {uid: "0"}, 
      mounted: false
    };
    this.refreshRoutines = this.refreshRoutines.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.applyOrder = this.applyOrder.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  routinesListener(){
    const _this = this, 
          user = this.state.user;

    this.fireRoutinesListener = database.collection('users').doc(user.uid).collection('routines').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        let data = doc.data();
            data.id = doc.id;
        output.push(data);
      });
      _this.setState({
        routinesList: output.length > 0 ? output : false, 
        pureList: output.length > 0 ? output : false
      });
    });
  }

  exercisesListener(){
    const _this = this;

    this.fireExercisesListener = database.collection('exercises').get().then((snapshot) => {
      const output = [];
      snapshot.forEach((doc) => {
        output.push(doc.data());
      });
      _this.setState({
        exercises: output, 
        loading:false
      })
    });
  }

  applyOrder(value, event){
    event.preventDefault();
    this.toggleDropdown();
    if (value !== "none"){
      this.setState({
        order:value
      });
    }
    else{
      this.setState({
        order:false
      });
    }
  }

  applyFilter(value, event){
    event.preventDefault();
    const _this = this;
    let filtered;
    switch(value){
      case "none" :
        _this.setState({
          routinesList: _this.state.pureList ? _this.state.pureList : _this.state.routinesList,
          filter:false
        });
      break; 

      case "normal" :
        filtered = _this.state.pureList.filter((obj) => { return obj.color === "#1FC3AF"});
        _this.setState({
          routinesList: filtered,
          filter:'normal'
        });
      break;

      case "medium" :
        filtered = _this.state.pureList.filter((obj) => { return obj.color === "#FCC05A"});
        _this.setState({
          routinesList: filtered,
          filter:'medium'
        });
      break;

      case "hard" :
        filtered = _this.state.pureList.filter((obj) => { return obj.color === "#FC5A5C"});
        _this.setState({
          routinesList: filtered,
          filter:'hard'
        });
      break;

      default:
        filtered = false;
        _this.setState({
          routinesList: _this.state.pureList ? _this.state.pureList : _this.state.routinesList,
          filter:false
        })
    }
  }

  toggleFilters(event){
    event.preventDefault();
    this.setState({
      toggleFilters: !this.state.toggleFilters
    });
  }

  toggleDropdown(){
    this.setState({
      toggleDropdown: !this.state.toggleDropdown
    })
  }


  componentWillMount() {
    const user = this.state.user;
    user.id = user.uid;
    this.setState({
      user: user
    });

    // Binding the listeners created above to this component
    this.routinesListener = this.routinesListener.bind(this);
    this.routinesListener();

    this.exercisesListener = this.exercisesListener.bind(this);
    this.exercisesListener();
  }

  componentWillUnmount() {
    this.routinesListener = undefined;
    this.exercisesListener = undefined;
  }

  componentDidMount(){
    document.title = "FitApp. - Vos programmes d'entraînement";
    const _this = this;
    setTimeout(() => {
      _this.setState({
        mounted:true
      });
    }, 200)
  }

  refreshRoutines(){
    this.routinesListener();
  }
  
  render() {
    // Routines are sorted by most recently performed to never used ever
    let routines =[];
    if(this.state.routinesList.length > 0 && this.state.routinesList){
      routines = this.state.routinesList.sort((a, b) => {
        var c, d;
        switch(this.state.order){
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

        if(this.state.order === 'low-use' || this.state.order === 'old'){
          return c<d ? -1 : c>d ? 1 : 0;
        }
        else{
          return c>d ? -1 : c<d ? 1 : 0;
        }

      });
    }

    return (
      <div className={this.state.mounted ? "AllRoutines loaded" : "AllRoutines"}>
        <div className="container animation-introduction">
          <div className="page-header">
            <Link to="/" title="Retour au dashboard"><i className="fa fa-angle-left"></i></Link>
            <h1>Mes entraînements</h1>
          </div>
        </div>
          {this.state.loading ? 
            <div className="container empty animation-contents">
              <div className="inlineLoader"><p>Chargement de vos données</p></div>
            </div>
            :
            <div className="container animation-contents">
              <div className="medium-8 columns teasers-list">
                {this.state.routinesList.length > 0 && this.state.routinesList ? 
                  <div className="all-routines">
                    <Routines rebuild={this.refreshRoutines} list={routines} exercisesDatabase={this.state.exercises} editable="true" user={this.state.user} refresh={this.refreshRoutines}/>
                  </div>
                  :
                  <div className="empty-workouts">
                    {this.state.filter ?
                      <p>Aucun entraînement ne correspond à ce filtre...</p>
                      :
                      <p>Vous n'avez enregistré aucun entrainement pour l'instant !</p>
                    }
                    <Link className="btn btn-default" to='/new-routine'>Créer un nouvel entraînement</Link>
                  </div>
                }
              </div>
              <div className="medium-4 columns teasers-controls">
                <Link className="btn btn-block" to='/new-routine'><i className="fa fa-plus"></i> Créer un nouvel entraînement</Link>
                {this.state.pureList.length > 0 && this.state.pureList ? 
                  <div>
                    <button className={this.state.toggleFilters ? "toggleFilters active" : "toggleFilters"} onClick={this.toggleFilters}>{this.state.order || this.state.filter ? <i className="fa fa-wrench"></i> : false }<i className="fa fa-sliders"></i> Filters <i className={this.state.toggleFilters ? "fa fa-angle-up" : "fa fa-angle-down"}></i></button>
                    <div className={this.state.toggleFilters ? "filters active" : "filters"}>
                      <h3 className="filter-title">Niveau</h3>
                      <div className="filter-zone">
                        <button className={!this.state.filter || this.state.filter === "none" ? "filter active" : "filter"} onClick={this.applyFilter.bind(this, 'none')}><span>Tous</span></button>
                        <button className={this.state.filter && this.state.filter === "normal" ? "filter active" : "filter"} onClick={this.applyFilter.bind(this, 'normal')}><span><i className="color-spot green"></i> Normal</span></button>
                        <button className={this.state.filter && this.state.filter === "medium" ? "filter active" : "filter"} onClick={this.applyFilter.bind(this, 'medium')}><span><i className="color-spot orange"></i> Moyen</span></button>
                        <button className={this.state.filter && this.state.filter === "hard" ? "filter active" : "filter"} onClick={this.applyFilter.bind(this, 'hard')}><span><i className="color-spot red"></i> Elevé</span></button>
                      </div>

                      <div className="filter-title">Classement</div>
                      <div className={this.state.toggleDropdown ? "filter-drop active" : "filter-drop"}>
                        <div className="current" onClick={this.toggleDropdown}>
                          {!this.state.order ? "Utilisation la plus récente" : null }
                          {this.state.order && this.state.order === "low-use" ? "Utilisation la moins récente" : null}
                          {this.state.order && this.state.order === "new" ? "Création la plus récente" : null}
                          {this.state.order && this.state.order === "old" ? "Création la moins récente" : null}
                          <i className={this.state.toggleDropdown ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                        </div>
                        <ul className="options">
                          <li><button className={!this.state.order ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'none')}><span>Utilisation la plus récente</span></button></li>
                          <li><button className={this.state.order && this.state.order === "low-use" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'low-use')}><span>Utilisation la moins récente</span></button></li>
                          <li><button className={this.state.order && this.state.order === "new" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'new')}><span>Création la plus récente</span></button></li>
                          <li><button className={this.state.order && this.state.order === "old" ? "filter active" : "filter"} onClick={this.applyOrder.bind(this, 'old')}><span>Création la moins récente</span></button></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                 : 
                  null
                } 
              </div>
            </div>
          }
      </div>
    )
  }
}

export default AllRoutines;
