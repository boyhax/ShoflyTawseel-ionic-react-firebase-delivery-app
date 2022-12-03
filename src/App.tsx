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
import SignIn from './pages/SignIn';
import GlobalProvider from './providers/globalsProvider';
import OrdersPage from './pages/OrdersPage';
import MapPage from './pages/MapPage';
import OrderPage from './pages/OrderPage';
import ApplicationsPage from './pages/ApplicationsPage';
import Chat from './pages/chat/chat';
import Chats from './pages/chat/chats';
import { Device } from '@capacitor/device';
import { FCM } from '@capacitor-community/fcm';
import { initializeApp } from 'firebase/app';
import { setupIonicReact } from '@ionic/react';
import { Config } from './config';
import { getFirestore } from 'firebase/firestore';
import CreateProfile from './pages/CreatProfile';
import ProfileID from './pages/ProfileID';
import AddOrderPage from './pages/AddOrderPage';
import MainMenu from './components/MainMenu';
import ProtectedRoute from './components/ProtectedRoute';
import Demo from './pages/Demo';


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
const language:"en"|"ar" = 'en'
export const getLang=()=>{return language}

export type Address={
address: string,
id:string,
location: {lat: string, lng: string},
name: string,
types: string[]
}
export async function getAddressOptions(text:string,call:(t:Address[])=>void){
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '5db7bea325msh20d1ea444db0b53p123e53jsn3b35fd61bc13',
      'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
    }
  };
  let r:any[] = []
  let url = 'https://trueway-places.p.rapidapi.com/FindPlaceByText?text=sur oman&language=ar';
  url.replace('text',text)
  let t = await (await fetch(url, options)).json();
  console.log('t :>> ', t);
  r=t
  call(r)
  return r
}

const App: React.FC = () => {


  return (
    <GlobalProvider>
      <IonApp>
      {/* <IonSplitPane contentId="main"> */}

        <IonReactRouter>
            <MainMenu  ></MainMenu>

            <IonRouterOutlet id='mainContent'>
              <Route path="/home" component={Home} exact={true} />
              <Route path="/Profile" component={Profile} />
              <Route path="/Profile/:id" component={ProfileID} />
              <Route path="/createProfile" component={CreateProfile} />

              <Route path="/details" component={Details} />
              <Route path="/SignIn" component={SignIn} />
              <Route path="/OrdersPage" component={OrdersPage} />
              <Route path="/OrdersPage/:id/:type" component={OrdersPage} />

              <Route path="/map/:location" component={MapPage} />
              <Route path="/map" component={MapPage} />
              <Route path="/order/:id?type" component={OrderPage} />
              <Route path="/applications/:id" component={ApplicationsPage} />
              <Route path="/chats/" component={Chats} />
              <Route path="/chats/:id" component={Chats} />
              <Route path="/AddOrderPage" component={AddOrderPage} />
              <Route path="/demo" component={Demo} />


              <Route path="/" render={() => <Redirect to="/home" />} exact={true} />
            </IonRouterOutlet>


        </IonReactRouter>
        {/* </IonSplitPane> */}

      </IonApp>
    </GlobalProvider>
  )
};

export default App;

