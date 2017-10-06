import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';


describe('The App component', () => {
  beforeAll(() => {
    const ls = require("../utils/localStorageMock.js");
    ls.setLocalStorage();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <App />
      </MemoryRouter>, 
    div);
  });
  
});
