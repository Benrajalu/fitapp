import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.js';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="App-header">
            <Link to="/"><img src={logo} className="App-logo" alt="logo" /></Link>
            <h2>This is a work in progress</h2>
          </div>
          <main>
            <Route exact path="/" component={Dashboard}/>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
