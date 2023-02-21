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
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { bookOutline, bookSharp, callOutline, chatboxOutline, closeOutline, informationCircleOutline, informationSharp, locationOutline, locationSharp, walletOutline, walletSharp } from "ionicons/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { avatarPLaceholder } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import { TT } from "./utlis/tt";

interface props extends ComponentProps {
  menuRef?: any;
}

const MainMenu = (Props: props) => {
  const { user, profile } = useGlobals();
  function close() {
    Props.menuRef.current.close();
  }
  useEffect(() => {
    //  menu.current!.toggle()
  });
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
        <IonToolbar
          color={"primary"}
          className={"flex h-32 items-center shadow-xl rounded-br-2xl"}
        >
          <IonAvatar slot={"primary"} onClick={()=>history.push('account')}>
            <IonImg
              src={profile?.photoURL || avatarPLaceholder(" s t")}
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
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList>
          <IonItem onClick={() => history.push("Wallet")}>
            <IonIcon icon={walletOutline} />

            <IonLabel>{TT("Wallet")}</IonLabel>
            <IonLabel slot={"end"}>{"0 OMR"}</IonLabel>
          </IonItem>
          <IonItem onClick={() => history.push("places")}>
            <IonIcon icon={locationOutline} />
            <IonLabel>{TT("Saved places")}</IonLabel>
          </IonItem>
          <IonItem onClick={() => history.push("myorders")}>
            <IonIcon icon={bookOutline} />
            <IonLabel>{TT("My orders")}</IonLabel>
          </IonItem>
          <IonItem onClick={() => history.push("chat")}>
            <IonIcon icon={chatboxOutline} />
            <IonLabel>{TT("Chat")}</IonLabel>
          </IonItem>
          <IonItem className="item" onClick={() => history.push("Details")}>
            <IonIcon icon={informationCircleOutline} />
            <IonLabel>{TT("Info")}</IonLabel>
          </IonItem>
          <IonItem className="item" onClick={() => history.push("contactus")}>
            <IonIcon icon={callOutline} />
            <IonLabel>{TT("Get in Touch")}</IonLabel>
          </IonItem>

          {profile?.role === "admin" && (
            <IonItem className="item" onClick={() => history.push("Demo")}>
              Dev Page
            </IonItem>
          )}
          <IonButtons slot={"end"} className="flex-end">
            {user ? SignOutButton : SignInButton}
          </IonButtons>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
export default MainMenu;
