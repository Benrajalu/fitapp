import React, { Component } from 'react';

import {fire, firebaseAuth} from '../utils/fire';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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

    console.log(this.state);
  }

  handleGoogleLogin(event){
    event.preventDefault();
    const provider = new fire.auth.GoogleAuthProvider();
    firebaseAuth.signInWithPopup(provider);
  }

  handleFacebookLogin(event){
    event.preventDefault();
    const provider = new fire.auth.FacebookAuthProvider();
    firebaseAuth.signInWithPopup(provider);
  }


  handleAccountCreation(event){
    event.preventDefault();
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), 
          _this = this;

    if(emailRegex.test(this.state.creationEmail) && this.state.creationPassword){
      firebaseAuth.createUserWithEmailAndPassword(this.state.creationEmail, this.state.creationPassword)
      .then((user) => {
        user.sendEmailVerification();
        console.log("coucou toi");
      })
      .catch(function(error) {
        var errorMessage = error.message;
        _this.setState({
          creationError: errorMessage
        })
        // ...
      });
    }
    else{
      this.setState({
        creationError: "Merci de renseigner une adresse email valide et un mot de passe."
      })
    }
    
  }

  handleAccountLogin(event){
    event.preventDefault();
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), 
          _this = this;

    if(emailRegex.test(this.state.email) && this.state.password){
      firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          console.log("re-coucou toi");
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          _this.setState({
            loginError: errorMessage
          })
        });
    }
    else{
      this.setState({
        loginError: "Merci de renseigner une adresse email valide et un mot de passe."
      })
    }
  }


  render() {
    return (
      <div className={this.state.loading ? "login loading" : "login"}>
        <div className="container">
          <div className="col-md-12">
            <div className="page-header">
              <h1>Connexion</h1>
            </div>
          </div>
        </div>

        <div className="container">
          <h3>Se connecter avec...</h3>
          <button className="btn btn-danger" onClick={this.handleGoogleLogin}>Connexion avec Google</button>
          <hr/>
          <button className="btn btn-primary" onClick={this.handleFacebookLogin}>Connexion avec Facebook</button>
          <hr/>
          <h4>Utiliser un compte mail</h4>
          <ul className="nav nav-tabs">
            <li role="presentation" className={this.state.connect ? "active" : false}><a onClick={() => {this.toggleTab('connect')}}>Login</a></li>
            <li role="presentation" className={this.state.register ? "active" : false}><a onClick={() => {this.toggleTab('register')}}>Register</a></li>
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
                 <label htmlFor="password">Password</label>
                 <input className="form-control" type="password" name="password" id="password" value={this.state.password ? this.state.password : ''} onChange={this.updateFields}/>
                </div>
                {this.state.loginError ? <p>{this.state.loginError}</p> : false}
                <button type="submit">Se connecter</button>
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
                 <label htmlFor="creationPassword">Password</label>
                 <input className="form-control" type="password" id="creationPassword" name="creationPassword" value={this.state.creationPassword ? this.state.creationPassword : ''} onChange={this.updateFields}/>
                </div>
                {this.state.creationError ? <p>{this.state.creationError}</p> : false}
                <button type="submit">Se connecter</button>
              </form>
            </div>
          }
        </div>
        
      </div>
    )
  }
}

export default Login;
