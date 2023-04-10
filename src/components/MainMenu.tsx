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
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  bookOutline,
  callOutline,
  chatboxOutline,
  informationCircleOutline,
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

  const history = useHistory();

  const SignOutButton = (
    <IonButton fill={"default"} onClick={() => getAuth().signOut()}>
      {TT("Sign Out")}
    </IonButton>
  );

  return (
    <IonMenu id="mainMenu" ref={Props.menuRef} contentId="main-content">
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
        <IonList>
          <IonMenuToggle>
            <IonItem onClick={() => history.push("chat")}>
              <IonIcon icon={chatboxOutline} />
              <IonLabel>{TT("Chat")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem className="item" onClick={() => history.push("Details")}>
              <IonIcon icon={informationCircleOutline} />
              <IonLabel>{TT("Info")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem className="item" onClick={() => history.push("contact")}>
              <IonIcon icon={callOutline} />
              <IonLabel>{TT("Get in Touch")}</IonLabel>
            </IonItem>
          </IonMenuToggle>

          {profile?.role === "admin" && (
            <IonMenuToggle>
              <IonItem className="item" onClick={() => history.push("/Demo")}>
                Demo
              </IonItem>
              <IonItem className="item" onClick={() => history.push("/admin")}>
                Admin panel
              </IonItem>
            </IonMenuToggle>
          )}
          <IonMenuToggle>
            <IonItem>
              <div className="flex-end">{user && SignOutButton}</div>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
      <IonFooter>
        <DriverUserToggleSegment />
      </IonFooter>
    </IonMenu>
  );
};
export default MainMenu;
