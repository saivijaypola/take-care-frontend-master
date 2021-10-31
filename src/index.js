import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import reducers from '../src/redux/reducer/index';
import sagas from '../src/redux/sagas/index';

import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
//firebase
//Grapql configuration 
import ApolloClient from 'apollo-boost';
import ReactGA from 'react-ga';
import 'semantic-ui-css/semantic.min.css'
ReactGA.initialize('G-REKX1MFP99');
ReactGA.pageview(window.location.pathname + window.location.search);
// Setup Saga Middleware
const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducers, applyMiddleware(sagaMiddleware, logger))
// const store = createStore(reducers, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(sagas)
store.subscribe(() => {

})

//firebase.initializeApp(firebaseConfig);


let graphqlEndpoint = process.env.REACT_APP_GRAPHQL_URI;
// const client = new ApolloClient({
//   uri: graphqlEndpoint, cache: new InMemoryCache({
//       dataIdFromObject: o => { o.id ? `${o.__typename}-${o.id}` : `${o.__typename}-${o.cursor}` },
//   })
// })

const app = (
  <Provider className="wrapper" store={store}>

    <BrowserRouter>
      <App />
    </BrowserRouter>

  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

