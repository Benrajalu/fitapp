import React, { Component } from 'react';

import {fire, firebaseAuth} from '../utils/fire';

import Loader from "../blocks/Loader.js"; 

import '../styles/login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      connect: true,
      register:false
    };

    this.toggleTab = this.toggleTab.bind(this);
    this.handleAccountCreation = this.handleAccountCreation.bind(this);
    this.handleAccountLogin = this.handleAccountLogin.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.updateFields = this.updateFields.bind(this);
  }

  toggleTab(target, event){
    if(target === "connect"){
      this.setState({
        register: false,
        connect: true
      });
    }
    else{
     this.setState({
       connect: false,
       register: true
     }); 
    }
  }

  updateFields(event){
    let target = event.target.name,
        value = event.target.value;

    this.setState({
      [target]: value
    });
  }

  handleGoogleLogin(event){
    event.preventDefault();
    const provider = new fire.auth.GoogleAuthProvider(), 
          _this = this;
    this.setState({
      googleLogin:true
    });
    firebaseAuth.signInWithPopup(provider).then(() => {
      _this.setState({
        loading:true
      });
    }).catch((error) => {
      _this.setState({
        loading:false,
        googleLogin:false
      });
    });
  }

  handleFacebookLogin(event){
    event.preventDefault();
    const provider = new fire.auth.FacebookAuthProvider(), 
          _this = this;
    this.setState({
      facebookLogin:true
    });
    firebaseAuth.signInWithPopup(provider).then(() => {
      _this.setState({
        loading:true
      });
    }).catch((error) => {
      _this.setState({
        loading:false,
        facebookLogin:false
      });
    });
  }

  handleAccountCreation(event){
    event.preventDefault();
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), 
          _this = this;

    if(emailRegex.test(this.state.creationEmail) && this.state.creationPassword){
      _this.setState({
        loading:true
      });
      firebaseAuth.createUserWithEmailAndPassword(this.state.creationEmail, this.state.creationPassword)
      .then((user) => {
        user.sendEmailVerification();
        console.log("coucou toi");
      })
      .catch(function(error) {
        var errorMessage = error.message;
        _this.setState({
          creationError: errorMessage, 
          loading:false
        })
        // ...
      });
    }
    else{
      this.setState({
        creationError: "Merci de renseigner une adresse email valide et un mot de passe.",
        loading:false
      })
    }
  }

  handleAccountLogin(event){
    event.preventDefault();
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), 
          _this = this;

    if(emailRegex.test(this.state.email) && this.state.password){
      _this.setState({
        loading:true
      });

      firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          console.log("re-coucou toi");
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          _this.setState({
            loginError: errorMessage,
            loading:false
          })
        });
    }
    else{
      this.setState({
        loginError: "Merci de renseigner une adresse email valide et un mot de passe.",
        loading:false
      })
    }
  }


  render() {
    return (
      <div className={this.state.loading ? "login loading" : "login"} id="login">
        <div className="contents">
          <p className="logo">Fit<strong>App.</strong></p> 
          <h1>Connexion</h1>

          <div className="login-box">
            <div className="socialAccount">
              <h3>Se connecter avec...</h3>
              <button className="btn google" onClick={this.handleGoogleLogin}>{this.state.googleLogin ? "Tentative de connexion..." : "Connexion avec Google" }</button>
              <hr/>
              <button className="btn facebook" onClick={this.handleFacebookLogin}>{this.state.facebookLogin ? "Tentative de connexion..." : "Connexion avec Facebook" }</button>
            </div>
            <div className="mailAccount">
              <h4>Utiliser un compte mail</h4>
              <ul className="nav nav-tabs">
                <li role="presentation" className={this.state.connect ? "active" : undefined}><a onClick={() => {this.toggleTab('connect')}}>Connexion</a></li>
                <li role="presentation" className={this.state.register ? "active" : undefined}><a onClick={() => {this.toggleTab('register')}}>Nouveau compte</a></li>
              </ul>
              {this.state.connect ?
                <div className="loginSection">
                  <h3>Se connecter</h3>
                  <form action="" onSubmit={this.handleAccountLogin}>
                    <div className="form-group">
                     <label htmlFor="email">Email</label>
                     <input className="form-control" type="email" name="email" id="email" value={this.state.email ? this.state.email : ''} onChange={this.updateFields}/>
                    </div>
                    <div className="form-group">
                     <label htmlFor="password">Mot de passe</label>
                     <input className="form-control" type="password" name="password" id="password" value={this.state.password ? this.state.password : ''} onChange={this.updateFields}/>
                    </div>
                    {this.state.loginError ? <p>{this.state.loginError}</p> : false}
                    <button type="submit" className="btn btn-size-s">Se connecter</button>
                  </form>
                </div>
              :
                <div className="loginSection">
                  <h3>Créer un compte</h3>
                  <form action="" onSubmit={this.handleAccountCreation}>
                    <div className="form-group">
                     <label htmlFor="creationEmail">Email</label>
                     <input className="form-control" type="email" id="creationEmail" name="creationEmail" value={this.state.creationEmail ? this.state.creationEmail : ''} onChange={this.updateFields}/>
                    </div>
                    <div className="form-group">
                     <label htmlFor="creationPassword">Mot de passe</label>
                     <input className="form-control" type="password" id="creationPassword" name="creationPassword" value={this.state.creationPassword ? this.state.creationPassword : ''} onChange={this.updateFields}/>
                    </div>
                    {this.state.creationError ? <p>{this.state.creationError}</p> : false}
                    <button type="submit" className="btn btn-size-s">Créer un compte</button>
                  </form>
                </div>
              }
            </div>
          </div>
        </div>
        <Loader />
      </div>
    )
  }
}

export default Login;
