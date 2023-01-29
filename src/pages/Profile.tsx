import React, { FC, useEffect, useState } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonList,
  IonSpinner,
  IonGrid,
  IonRow,
  IonAvatar,
  IonImg,
  IonCol,
  IonCard,
  IonCardContent,
  IonInput,
  IonPopover,
  IonCardHeader,
  IonCardTitle,
  IonItem,
} from "@ionic/react";
import {
  logOutOutline,
  mailOutline,
  personCircleOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { useGlobals } from "../providers/globalsProvider";
import { getAuth } from "firebase/auth";
import OrderCard from "../components/OrderCard";
import { updateUserProfile } from "../providers/firebaseMain";
import { TT } from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import AvatarPicker from "../components/AvatarPicker";
import { Redirect, useHistory } from "react-router";
import { usePhoto } from "../hooks/usePhoto";
import Page from "../components/Page";
import useUserApplications from "../hooks/useUserApplications";
import useUserOrders from "../hooks/useUserOrders";

const Profile: React.FC = () => {
  const { user, profile } = useGlobals();
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );
  const [pickAvatar, setPickAvatar] = useState(false);

  const photo = usePhoto();
  const history = useHistory();
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {}, [user]);

  return (
    <Page>
      <IonContent fullscreen>
        <div className={'flex flex-col items-center justify-center m-5'}>
  
              <IonAvatar className={"w-24 h-24"} id="click-trigger">
                <IonImg
                  src={
                    !!profile?.photoURL
                      ? profile.photoURL
                      : require("../assets/avatarPlaceHolder.png")
                  }
                ></IonImg>
              </IonAvatar>
              <IonPopover trigger="click-trigger" triggerAction="click">
                <IonContent class="ion-padding">
                  <IonButton
                    disabled={photo.loading}
                    onClick={() => photo.takePhoto()}
                    fill={"clear"}
                  >
                    {photo.loading ? "Loading..." : "Upload Photo"}
                  </IonButton>
                  <span>OR</span>
                  <IonButton
                    onClick={() => setPickAvatar(!pickAvatar)}
                    fill={"clear"}
                  >
                    {" "}
                    choose avatar
                  </IonButton>
                  <div>
                    <AvatarPicker
                      isOpen={pickAvatar}
                      onDidDismiss={() => setPickAvatar(false)}
                      onAvatarSubmit={(url) => {
                        updateUserProfile(uid, { photoURL: url });
                      }}
                    ></AvatarPicker>
                  </div>
                </IonContent>
              </IonPopover>
              <IonRow>
                <IonButtons>
                  <IonButton
                    onClick={() =>
                      content !== "editProfile"
                        ? setContent("editProfile")
                        : setContent("orders")
                    }
                  >
                    {TT("edit")}
                  </IonButton>
                  <IonButton
                    color={"danger"}
                    onClick={() => {
                      getAuth().signOut();
                    }}
                  >
                    {TT("logOut")}
                    <IonIcon icon={logOutOutline}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonRow>
            
        </div>
        <IonList>
          <IonItem>
            <IonIcon icon={personCircleOutline} />
            <IonInput
              slot={"end"}
              value={profile?.name || "Name"}
              disabled={true}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} />
            <IonInput
              slot={"end"}
              value={profile?.email || "No Email"}
              disabled={true}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonIcon icon={phonePortraitOutline} />
            <IonInput
              slot={"end"}
              value={profile?.phoneNumber || "No Email"}
              disabled={true}
            ></IonInput>
          </IonItem>
        </IonList>

        {content === "editProfile" && (
          <IonContent>
            <CreatProfile
              onSave={() => {
                setContent("deliver");
              }}
            />
          </IonContent>
        )}
      </IonContent>
    </Page>
  );
};

export default Profile;

const infoContainer: any = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.8rem",
  paddingInlineStart: "2rem",
};
