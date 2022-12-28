import React, { } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
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
/* Theme variables */
import './theme/variables.css';
/* Global CSS */
import './global.css';
import Profile from './pages/Profile';
import SignIn from './pages/authPages';
import SignedIn from './pages/authPages/SignedIn';
import GlobalProvider from './providers/globalsProvider';
import OrdersPage from './pages/OrdersPage';
import MapPage from './pages/MapPage';
import OrderPage from './pages/OrderPage';
import Chats from './pages/chat/chats';
import { Device } from '@capacitor/device';
import { FCM } from '@capacitor-community/fcm';
import { initializeApp } from 'firebase/app';
import { setupIonicReact } from '@ionic/react';
import { Config } from './config';
import { getFirestore } from 'firebase/firestore';
import CreateProfile from './pages/CreatProfile';
import ProfileID from './pages/ProfileID';
import AddOrderPage from './pages/AddOrderPage/AddOrderPage';
import MainMenu from './components/MainMenu';
import Demo from './pages/Demo';
import AuthRoute from './routes/AuthRoute';
import DevloperRoute from './routes/DevloperRoute';




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

  return (
    <React.StrictMode>
    <GlobalProvider>
      <IonApp>

        {/* <IonSplitPane contentId="main"> */}

        <IonReactRouter>
          <MainMenu  ></MainMenu>

          <IonRouterOutlet id='mainContent'>
            <Route path={"/Profile"} exact={true}>
              <AuthRoute>
                <Profile></Profile>
              </AuthRoute>
            </Route>
            <Route path={"/AddOrderPage"}>
              <AuthRoute>
              <AddOrderPage></AddOrderPage>
              </AuthRoute>
            </Route>
            <Route path={"/SignedIn"}>
              <AuthRoute>
              <SignedIn></SignedIn>
              </AuthRoute>
            </Route>

            <Route path="/home" component={Home} exact={true} />
            <Route path="/Profile/:id" exact={true} component={ProfileID} />
            <Route path="/createProfile" component={CreateProfile} />

            <Route path="/details" component={Details} />
            <Route path="/SignIn" component={SignIn} />
            <Route path="/OrdersPage" component={OrdersPage} />
            <Route path="/OrdersPage/:id/:type" component={OrdersPage} />

            <Route path="/map/:location" component={MapPage} />
            <Route path="/map" component={MapPage} />
            <Route path="/order/:id?type" component={OrderPage} />
            {/* <Route path="/applications/:id" component={ApplicationsPage} /> */}
            <Route path="/chats/" component={Chats} />
            <Route path="/chats/:id" component={Chats} />
            {/* <Route path="/AddOrderPage" component={AddOrderPage} /> */}
            
            <Route path="/demo"  >
            <DevloperRoute>
              <Demo></Demo>
              </DevloperRoute>
            </Route>


            <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
          </IonRouterOutlet>


        </IonReactRouter>
        {/* </IonSplitPane> */}

      </IonApp>
    </GlobalProvider>
    </React.StrictMode>
  )
};

export default App;

