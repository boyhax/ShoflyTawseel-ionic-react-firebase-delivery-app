import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";
/* Tailwind styles */
import "./theme/tailwind.css";
/* Global CSS */
import "./global.css";
import '../node_modules/leaflet-geosearch/dist/geosearch.css'

import GlobalProvider from "./providers/globalsProvider";
import Chats from "./pages/chat/chats";
import { Device } from "@capacitor/device";
import { FCM } from "@capacitor-community/fcm";
import { setupIonicReact } from "@ionic/react";
import AddOrderPage from "./pages/AddOrderPage";
import Demo from "./pages/Demo";
import AuthRoute from "./routes/AuthRoute";
import {
  chatboxOutline,
  homeOutline,
  listOutline,
  personOutline,
} from "ionicons/icons";
import { App as cApp } from "@capacitor/app";
import MainMenu from "./components/MainMenu";
import Profile from "./pages/Profile";
import OrdersPage from "./pages/OrdersPage";
import { mydb } from "./providers/firebaseMain";
import { Store } from "pullstate";
import DriverApplication from "./pages/DriverApplication";
import AdminRoute from "./routes/AdminRoute";
import AdminPage from "./pages/Admin";
import Account from "./pages/account";
import MyOrders from "./pages/MyOrders";
import { TT } from "./components/utlis/tt";

setupIonicReact({
  mode: "ios",
});

export var token: string = "";

Device.getInfo().then((v) => {
  console.log("platform :>> ", v.platform);
  if (["android", "ios"].includes(v.platform)) {
    FCM.getToken().then((t) => {
      token = t.token;
      mydb.setUserToken(t.token);
    });
  }
});
const languageStore = new Store<{lang:languages}>({lang:'ar'})
type languages="en" | "ar"
var language: languages = "ar";

languageStore.subscribe(s=>s,(s)=>{
  language = s.lang
  const htmlel:any = document.getElementsByName('html')
  htmlel.style.direction = s.lang==='en'?'ltr':'rtl'
})
export const getLang = () => {
  return language;
};

const App: React.FC = () => {
  const ionRouter = useIonRouter();
  const {lang} = languageStore.useState()
  document.body.style.direction = TT('dir',lang)
  console.log('body direction :>> ',   document.body.style.direction
  );
  const toggleMenu = () => {
    const menu: any = document.getElementById("mainMenu");
    menu.toggle();
  };

  document.addEventListener("ionBackButton", (ev: any) => {
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        cApp.exitApp();
      }
    });
  });

  return (
    <React.StrictMode>
      <GlobalProvider>
        <IonApp 
        // className={`${TT('dir')}`}
        >
          

          <IonReactRouter>
          <MainMenu/>
        
            <IonTabs >
              <IonRouterOutlet id="main-content">
                <Switch>
                  <Route exact path="/orders">
                    <AuthRoute>
                      <OrdersPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/account">
                    <AuthRoute>
                      <Account />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/profile/:id">
                    <AuthRoute>
                      <Profile />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route exact path="/myorders">
                    <AuthRoute>
                      <MyOrders />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/chat">
                    <AuthRoute>
                      <Chats />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/chat/:id">
                    <AuthRoute>
                      <Chats />
                    </AuthRoute>
                    </Route>
                    <Route exact path="/admin">
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                    </Route>
                  <Route exact path="/demo">
                    <Demo />
                  </Route>
                  <Route exact path="/driverapplication">
                    <DriverApplication/>
                  </Route>
                  <Route exact path="/addorder">
                    <AuthRoute>
                      <AddOrderPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                </Switch>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                {/* <IonTabButton tab="menu" onClick={toggleMenu} >
                  <IonIcon icon={menuOutline} />
                  <IonLabel>Menu</IonLabel>
                </IonTabButton> */}
                <IonTabButton tab="orders" href="/orders">
                  <IonIcon icon={listOutline} />
                  <IonLabel>Orders</IonLabel>
                </IonTabButton>
                <IonTabButton tab="account" href="/account">
                  <IonIcon icon={personOutline} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="chat" href="/chat/">
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
  );
};

export default App;
