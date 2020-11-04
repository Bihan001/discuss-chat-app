import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const AppRouter = withRouter(App);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </Router>,
  document.getElementById('root')
);
