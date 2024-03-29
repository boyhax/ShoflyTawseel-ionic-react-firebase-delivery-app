import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet, useIonRouter } from "@ionic/react";
import { Storage } from "@ionic/storage";
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
import "../node_modules/leaflet-geosearch/dist/geosearch.css";
import "react-phone-input-2/lib/style.css";

import GlobalProvider from "./providers/globalsProvider";
import Chats from "./pages/chat/chats";
import { Device } from "@capacitor/device";
import { setupIonicReact } from "@ionic/react";
import AddOrderPage from "./pages/AddOrderPage";
import Demo from "./pages/Demo";
import AuthRoute from "./routes/AuthRoute";
import { App as cApp } from "@capacitor/app";
import MainMenu from "./components/MainMenu";
import Profile from "./pages/Profile";
import OrdersPage from "./pages/OrdersPage";
import { Store } from "pullstate";
import AdminRoute from "./routes/AdminRoute";
import AdminPage from "./pages/Admin";
import Account from "./pages/account";
import MyOrders from "./pages/MyOrders";
import { TT } from "./components/utlis/tt";
import { Preferences } from "@capacitor/preferences";
import RulesAndPolicyPage from "./pages/RulesAndPolicyPage";
import { driverModeStore } from "./hooks/useDriverUserMode";
import ContactUsPage from "./pages/ContactUsPage";
import Details from "./pages/Details";
import DriverUpdatePage from "./pages/DriverUpdate";
import DriverRoute from "./routes/DriverRoute";
import pushFCM from "./services/pushFCM";
import DriverApplicationPage from "./pages/DriverApplication";
import HomeDriver from "./pages/HomeDriver";
import HomeUser from "./pages/HomeUser";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Locations from "./pages/Locations";
import ChatProvider from "./providers/chatProvider";
import Chat from "./pages/chat/chat";
import MapPage from "./pages/MapPage";

setupIonicReact({
  mode: "ios",
});
export var storage: Storage;
async function setupStorage() {
  storage = await new Storage().create();
}
setupStorage().then(() => {
  storage.get("lang").then((v) => {
    if (v) {
      language = v;
    } else {
      storage.set("lang", language);
    }
  });
  storage.get("driverMode").then((v) => {
    if (v) {
      driverModeStore.update((s) => {
        s.driverMode = v;
      });
    } else {
      storage.set("driverMode", false);
    }
  });
});

export var token: string = "";
const DeviceStore = new Store({
  device: "web",
});
Device.getInfo().then((v) => {
  console.log("platform :>> ", v.platform);
  DeviceStore.update((s) => {
    s.device = v.platform;
  });

  
});
export const languageStore = new Store<{ lang: languages }>({ lang: "ar" });
type languages = "en" | "ar";
var language: languages = "ar";

languageStore.subscribe(
  (s) => s,
  (s) => {
    Preferences.set({ key: "lang", value: s.lang });
    language = s.lang;
  }
);
export const getLang = () => {
  return language;
};

const App: React.FC = () => {
  const ionRouter = useIonRouter();
  const { lang } = languageStore.useState();
  document.body.style.direction = TT("dir", lang);
  const {device} = DeviceStore.useState()
  useEffect(() => {
    if (device !== "web") {
      pushFCM.start();
    }
  }, [device]);
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
        <ChatProvider>

        
        <IonReactRouter>
          <Switch>
            <IonApp>
              <MainMenu />

              {/* <IonTabs> */}
              <IonRouterOutlet id="main-content">
                <Route exact path="/AppRulesAndPolicy">
                  <RulesAndPolicyPage />
                </Route>
                <AuthRoute>
                  <Route exact path="/orders">
                    <AuthRoute>
                      <OrdersPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/user">
                    <AuthRoute>
                      <HomeUser />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/driver">
                    <AuthRoute>
                      <HomeDriver />
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
                      <Chat />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/contact">
                    <AuthRoute>
                      <ContactUsPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/map">
                    <AuthRoute>
                      <MapPage />
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
                    <AuthRoute>
                      <DriverApplicationPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/driverupdate">
                    <AuthRoute>
                      <DriverRoute>
                        <DriverUpdatePage />
                      </DriverRoute>
                    </AuthRoute>
                  </Route>
                  <Route exact path="/addorder">
                    <AuthRoute>
                      <AddOrderPage />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/details">
                    <Details />
                  </Route>
                  <Route exact path="/settings">
                    <Settings />
                  </Route>
                  <Route exact path="/locations">
                    <Locations />
                  </Route>
                  <Route exact path="/notifications">
                    <Notifications />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/home" />
                  </Route>
                </AuthRoute>
              </IonRouterOutlet>
              {/* <IonTabBar slot="bottom"> */}
              {/* <IonTabButton tab="menu" onClick={toggleMenu} >
                  <IonIcon icon={menuOutline} />
                  <IonLabel>Menu</IonLabel>
                </IonTabButton> */}

              {/* <IonTabButton tab="account" href="/account">
                  <IonIcon icon={personOutline} />
                  <IonLabel>{TT("Account")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="orders" href="/orders">
                  <IonIcon icon={listOutline} />
                  <IonLabel>{TT('Orders')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>{TT("Home")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="chat" href="/chat/">
                  <IonIcon icon={chatboxOutline} />
                  <IonLabel>{TT("Chat")}</IonLabel>
                </IonTabButton>
                {process.env.NODE_ENV === "development" && (
                  <IonTabButton tab="demo" href="/demo">
                    <IonIcon icon={chatboxOutline} />
                    <IonLabel>Demo</IonLabel>
                  </IonTabButton>
                )}
              </IonTabBar> */}
              {/* </IonTabs> */}
            </IonApp>
          </Switch>
        </IonReactRouter>
        </ChatProvider>
      </GlobalProvider>
    </React.StrictMode>
  );
};

export default App;
