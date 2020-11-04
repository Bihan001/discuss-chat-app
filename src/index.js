import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';

const AppRouter = withRouter(App);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </Router>,
  document.getElementById('root')
);
