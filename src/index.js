import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const AppRouter = withRouter(App);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
