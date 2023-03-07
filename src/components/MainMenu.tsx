import { ComponentProps } from "@ionic/core";
import {
  IonContent,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonList,
  IonItem,
  IonMenu,
  IonButtons,
  IonButton,
  IonIcon,
  IonRippleEffect,
  IonLabel,
  IonAvatar,
  IonImg,
  IonMenuToggle,
  IonFooter,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  bookOutline,
  bookSharp,
  callOutline,
  chatboxOutline,
  closeOutline,
  informationCircleOutline,
  informationSharp,
  locationOutline,
  locationSharp,
  walletOutline,
  walletSharp,
} from "ionicons/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { avatarPLaceholder } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import DriverUserToggleSegment from "./DriverUserToggleSegment";
import { TT } from "./utlis/tt";

interface props extends ComponentProps {
  menuRef?: any;
}

const MainMenu = (Props: props) => {
  const { user, profile } = useGlobals();

  const history = useHistory();
  const SignInButton = (
    <IonButton onClick={() => history.push("SignIn")}>Sign In</IonButton>
  );
  const SignOutButton = (
    <IonButton color="danger" onClick={() => getAuth().signOut()}>
      Sign Out
    </IonButton>
  );

  return (
    <IonMenu id="mainMenu" ref={Props.menuRef} contentId="main-content">
      <IonHeader>
        <IonMenuToggle>
          <IonToolbar
            onClick={() => history.push("/account")}
            color={"primary"}
            className={"flex h-32 items-center shadow-xl rounded-br-2xl"}
          >
            <IonAvatar slot={"primary"}>
              <IonImg
                src={
                  profile
                    ? profile.photoURL || avatarPLaceholder(" s t")
                    : avatarPLaceholder(" s t")
                }
              ></IonImg>
            </IonAvatar>

            <IonLabel>
              {user
                ? profile
                  ? profile.phoneNumber!
                  : profile === undefined
                  ? ".."
                  : ""
                : ""}
            </IonLabel>
          </IonToolbar>
        </IonMenuToggle>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList>
          {/* <IonItem onClick={() => history.push("Wallet")}>
            <IonIcon icon={walletOutline} />

            <IonLabel>{TT("Wallet")}</IonLabel>
            <IonLabel slot={"end"}>{"0 OMR"}</IonLabel>
          </IonItem> */}
          {/* <IonItem onClick={() => history.push("places")}>
            <IonIcon icon={locationOutline} />
            <IonLabel>{TT("Saved places")}</IonLabel>
          </IonItem> */}
          <IonMenuToggle>
            <IonItem onClick={() => history.push("myorders")}>
              <IonIcon icon={bookOutline} />
              <IonLabel>{TT("My orders")}</IonLabel>
            </IonItem>
          </IonMenuToggle>
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
            <IonItem className="item" onClick={() => history.push("contactus")}>
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
          <IonButtons slot={"end"} className="flex-end">
            {user ? SignOutButton : SignInButton}
          </IonButtons>
        </IonList>
      </IonContent>
      <IonFooter>
        <DriverUserToggleSegment />
      </IonFooter>
    </IonMenu>
  );
};
export default MainMenu;
