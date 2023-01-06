import React, { } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

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
/* Theme variables */
import './theme/variables.css';
/* Tailwind styles */
import './theme/tailwind.css';
/* Global CSS */
import './global.css';
import GlobalProvider from './providers/globalsProvider';
import Chats from './pages/chat/chats';
import { Device } from '@capacitor/device';
import { FCM } from '@capacitor-community/fcm';
import { initializeApp } from 'firebase/app';
import { setupIonicReact } from '@ionic/react';
import { Config } from './config';
import { getFirestore } from 'firebase/firestore';
import AddOrderPage from './pages/AddOrderPage/AddOrderPage';
import Demo from './pages/Demo';
import AuthRoute from './routes/AuthRoute';
import { chatboxOutline, homeOutline, personOutline } from 'ionicons/icons';
import { userStore } from './Stores/userStore';
import  {App as cApp}  from '@capacitor/app';



const firebaseConfig = Config()
initializeApp(firebaseConfig)
export const db = getFirestore()


setupIonicReact({
  mode: 'md'
});

export var token: string = ""

Device.getInfo().then((v) => {
  console.log('platform :>> ', v.platform);
  if (["android", "ios"].includes(v.platform)) {
    FCM.getToken().then((t) => {
      token = t.token
    })
  }
})
const language: "en" | "ar" = 'en'
export const getLang = () => { return language }



const App: React.FC = () => {
  const { profile } = userStore.useState()
  const ionRouter = useIonRouter();
  document.addEventListener('ionBackButton', (ev:any) => {
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        cApp.exitApp();
      }
    });
  });
  return (
    <React.StrictMode>
      <GlobalProvider>
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet id="main-content">
              <Route exact path="/addorder">
                  <AddOrderPage/>
                </Route>
                <Route exact path="/tab1">
                  <AuthRoute />
                </Route>
                <Route exact path="/tab2">
                  <Home />
                </Route>
                <Route path="/tab3">
                  <Chats />
                </Route>
                <Route path="/demo">
                  <Demo />
                </Route>
                <Route exact path="/">
                  <Redirect to="/tab2" />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon icon={personOutline} />
                  {/* <IonAvatar style={{ width: '30px', height: '30px' }}>
                    <IonImg src={profile !== "loading" ? profile?.photoURL! : avatarPLaceholder}>
                    </IonImg>
                  </IonAvatar> */}

                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon icon={chatboxOutline} />
                  <IonLabel>Chat</IonLabel>
                </IonTabButton>
                <IonTabButton tab="demo" href="/demo">
                  <IonIcon icon={chatboxOutline} />
                  <IonLabel>Demo</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonApp>
      </GlobalProvider>
    </React.StrictMode>
  )
};

export default App;

