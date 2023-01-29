import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonButton,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonRouterOutlet,
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
import GlobalProvider from "./providers/globalsProvider";
import Chats from "./pages/chat/chats";
import { Device } from "@capacitor/device";
import { FCM } from "@capacitor-community/fcm";
import { initializeApp } from "firebase/app";
import { setupIonicReact } from "@ionic/react";
import { Config } from "./config";
import { getFirestore } from "firebase/firestore";
import AddOrderPage from "./pages/AddOrderPage";
import Demo from "./pages/Demo";
import AuthRoute from "./routes/AuthRoute";
import {
  chatboxOutline,
  homeOutline,
  listOutline,
  menuOutline,
  personOutline,
} from "ionicons/icons";
import { userStore } from "./Stores/userStore";
import { App as cApp } from "@capacitor/app";
import MainMenu from "./components/MainMenu";
import Profile from "./pages/Profile";
import OrdersPage from "./pages/OrdersPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { mydb } from "./providers/firebaseMain";
import { Store } from "pullstate";

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
  document.body.style.direction = lang==='en'?'ltr':'rtl'
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
        <IonApp className={`${lang==='en'?'ltr':'rtl'}`}>
          <IonReactRouter>
            <MainMenu></MainMenu>

            <IonTabs >
              <IonRouterOutlet id="main-content">
                <Switch>
                  <Route exact path="/orders">
                    <AuthRoute>
                      <OrdersPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/tab1">
                    <AuthRoute>
                      <Profile />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/tab2">
                    <Home />
                  </Route>
                  <Route path="/chat">
                    <AuthRoute>
                      <Chats />
                    </AuthRoute>
                  </Route>
                  <Route path="/chat/:id">
                    <AuthRoute>
                      <Chats />
                    </AuthRoute>
                    </Route>
                  <Route exact path="/demo">
                    <Demo />
                  </Route>
                  <Route exact path="/addorder">
                    <AuthRoute>
                      <AddOrderPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/tab2" />
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
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon icon={personOutline} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
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
