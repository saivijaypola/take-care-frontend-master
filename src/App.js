import React, { Component } from "react";
import { Switch, BrowserRouter as Router, withRouter } from "react-router-dom";
import PWAPrompt from 'react-ios-pwa-prompt'
import { makeStyles } from '@material-ui/core/styles';
// Import Routes
import { publicRoutes, authProtectedRoutes } from "./routes/";
import AppRoute from "./routes/routes";
// import { Alert, AlertTitle } from '@material-ui/lab';
// Import Css
import './Apps.scss';
import './assets/css/materialdesignicons.min.css';
import './assets/css/colors/default.css';
import './App.css';
import Layout from "./components/Layout/index";
import AuthorizedLayout from "./components/Layout/Authorized";
import axios from "axios";
import firebase from "firebase/app";
import { InitSentry } from "./utils/sentry";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


//Initialize Sentry IO
InitSentry()

axios.interceptors.request.use(async config => {

  return new Promise(async (resolve, reject) => {
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user != null) {

        config.headers["x-access-token"] = await firebase.auth().currentUser.getIdToken()
        resolve(config)
      } else {
        // this.name = "Unknown";
        resolve(config)
      }
    });

  })
})

if ("serviceWorker" in navigator) {
  let newWorker;
  navigator.serviceWorker
    .register('sw.js')
    .then(function (reg) {
      console.log("Registration successful, scope is:", reg.scope);

      reg.addEventListener('updatefound', () => {
        // A wild service worker has appeared in reg.installing!
        newWorker = reg.installing;

        newWorker.addEventListener('statechange', () => {
          // Has network.state changed?
          switch (newWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // new update available
                //   showUpdateBar();
              }
              // No update available
              break;
          }
        });
      });



      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}



class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <React.Fragment>
        <PWAPrompt promptOnVisit={1} timesToShow={2} copyClosePrompt="Close" permanentlyHideOnDismiss={false} />
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={AuthorizedLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
              />
            ))}
          </Switch>
        </Router>

      </React.Fragment>
    )
  }
}

export default withRouter(App);