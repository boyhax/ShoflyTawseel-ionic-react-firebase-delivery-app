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
import DriverApplication from "./pages/DriverApplication";
import AdminRoute from "./routes/AdminRoute";
import AdminPage from "./pages/Admin";
import Account from "./pages/account";
import MyOrders from "./pages/MyOrders";
import { TT } from "./components/utlis/tt";
import { Preferences } from "@capacitor/preferences";
import RulesAndPolicyPage from "./pages/RulesAndPolicyPage";
import { driverModeStore } from "./hooks/useDriverUserMode";

fetch("https://PQBQ88ZFG8C4VGQL8YFFSXV26M5CIT9R@topiier.com/api/addresses/1", {
  headers: { "Output-Format": "JSON" },
}).then((res) => {console.log('topiier api responce :>> ', res);});
setupIonicReact({
  // mode: "ios",
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

  if (["android", "ios"].includes(v.platform)) {
    // FCM.getToken().then((t) => {
    //   token = t.token;
    //   mydb.setUserToken(t.token);
    // });
  }
});
const languageStore = new Store<{ lang: languages }>({ lang: "ar" });
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
        <IonReactRouter>
          <Switch>
            <IonApp
            // className={`${TT('dir')}`}
            >
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
                    <AuthRoute>
                      <DriverApplication />
                    </AuthRoute>
                  </Route>
                  <Route exact path="/addorder">
                    <AuthRoute>
                      <AddOrderPage />
                    </AuthRoute>
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
      </GlobalProvider>
    </React.StrictMode>
  );
};

export default App;
