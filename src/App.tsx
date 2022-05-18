import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { square, triangle, images, home, personCircleSharp } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
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
import GlobalProvider from './providers/globalsProvider';
import { browserPopupRedirectResolver, browserSessionPersistence, initializeAuth } from 'firebase/auth';
const firebaseConfig=Config

const firebaseApp = initializeApp(firebaseConfig)

const auth = initializeAuth(firebaseApp, {
  persistence: browserSessionPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
const App: React.FC = () => {
  
  
  return(
  <GlobalProvider>
    <IonApp>
    <IonReactRouter>
    <IonRouterOutlet>
          <Route path="/home" component={Tab1} exact={true} />
          <Route path="/Profile" component={Profile} exact={true} />
          <Route path="/tab2/details" component={Details} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
          
        </IonRouterOutlet>
      {/* <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1" component={Tab1} exact={true} />
          <Route path="/Profile" component={Profile} exact={true} />
          <Route path="/tab2/details" component={Details} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
          
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="tab2" href="/Profile">
            <IonIcon icon={personCircleSharp} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs> */}
    </IonReactRouter>
  </IonApp>
  </GlobalProvider>
)};

export default App;
