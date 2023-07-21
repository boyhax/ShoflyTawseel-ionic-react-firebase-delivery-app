import { ComponentProps } from "@ionic/core";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonMenu,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonAvatar,
  IonImg,
  IonMenuToggle,
  IonFooter,
  useIonRouter,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  bookOutline,
  callOutline,
  chatboxOutline,
  homeOutline,
  informationCircleOutline,
  settingsOutline,
} from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import { avatarPLaceholder } from "../api/firebaseMain";
import { userStore } from "../Stores/userStore";
import DriverUserToggleSegment from "./DriverUserToggleSegment";
import { TT } from "./utlis/tt";

interface props extends ComponentProps {
  menuRef?: any;
}

const MainMenu = (Props: props) => {
  const { user, profile } = userStore.useState();
  const history = useIonRouter();

  const SignOutButton = (
    <IonButton fill={"default"} onClick={() => getAuth().signOut()}>
      {TT("Sign Out")}
    </IonButton>
  );

  return (
    <IonMenu id="mainMenu" ref={Props.menuRef} contentId="main-content" side={'start'}>
      <IonHeader>
        <IonMenuToggle>
          <IonToolbar
            onClick={() => history.push("/account")}
            color={"primary"}
            style={{ direction: "ltr" }}
            className={"flex  items-center shadow-xl "}
          >
            <IonAvatar slot={"start"}>
              <IonImg
                src={
                  profile
                    ? profile.photoURL || avatarPLaceholder(" s t")
                    : avatarPLaceholder(" s t")
                }
              ></IonImg>
            </IonAvatar>
            <div className={"flex m-3 flex-col "}>
              <IonLabel>
                {user
                  ? profile
                    ? profile.name!
                    : profile === undefined
                    ? ".."
                    : ""
                  : ""}
              </IonLabel>
              <IonLabel>
                {user
                  ? profile
                    ? profile.phoneNumber!
                    : profile === undefined
                    ? ".."
                    : ""
                  : ""}
              </IonLabel>
            </div>
          </IonToolbar>
        </IonMenuToggle>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList style={{direction:'ltr'}}>
        <IonMenuToggle>
            <IonItem  onClick={() => history.push("/")}>
              <IonIcon icon={homeOutline} />
              <IonLabel className={'mx-1'}>{TT("Home")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem onClick={() => history.push("chat")}>
              <IonIcon icon={chatboxOutline} />
              <IonLabel className={'mx-1'}>{TT("Chat")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem  onClick={() => history.push("Details")}>
              <IonIcon icon={informationCircleOutline} />
              <IonLabel className={'mx-1'}>{TT("Info")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem  onClick={() => history.push("contact")}>
              <IonIcon icon={callOutline} />
              <IonLabel className={'mx-1'}>{TT("Get in Touch")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem  onClick={() => history.push("/settings")}>
              <IonIcon icon={settingsOutline} />
              <IonLabel className={'mx-1'}>{TT("Settings")}</IonLabel>
            </IonItem>
          </IonMenuToggle>

          
          <IonMenuToggle>
            <IonItem>
              <div className="flex-end">{user && SignOutButton}</div>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
      {profile?.role === "admin" && (
            <IonMenuToggle className={'top-auto flex justify-evenly'}>
              <IonButton  onClick={() => history.push("/Demo")}>
                Demo
              </IonButton>
              <IonButton  onClick={() => history.push("/admin")}>
                Admin panel
              </IonButton>
            </IonMenuToggle>
          )}
      <IonFooter>
        <DriverUserToggleSegment />
      </IonFooter>
    </IonMenu>
  );
};
export default MainMenu;
