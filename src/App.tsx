import React, { FC, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Details from './pages/Details';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import {FirebaseApp, getApps,initializeApp} from 'firebase/app';
/* Theme variables */
import './theme/variables.css';
import {Config} from"./config"
/* Global CSS */
import './global.css';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import GlobalProvider, { useGlobals } from './providers/globalsProvider';
const firebaseConfig=Config

const firebaseApp = initializeApp(firebaseConfig)
setupIonicReact({
  mode: 'md'
});

const App: React.FC = () => {
  
  
  return(
  <GlobalProvider>
    <IonApp>
    <IonReactRouter>
    <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/Profile" component={Profile} />
          <Route path="/Profile/:id" component={Profile} />
          <Route path="/details" component={Details} />
          <Route path="/SignIn" component={SignIn} />

          <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
        </IonRouterOutlet>
      
    </IonReactRouter>
  </IonApp>
  </GlobalProvider>
)};

export default App;

