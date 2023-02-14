import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonList,
  IonRow,
  IonAvatar,
  IonImg,
  IonInput,
  IonPopover,
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
import { mydb, updateUserProfile } from "../providers/firebaseMain";
import { TT } from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import AvatarPicker from "../components/AvatarPicker";
import { useHistory } from "react-router";
import { usePhoto } from "../hooks/usePhoto";
import Page from "../components/Page";
import ProfileAvatar from "../components/ProfileAvatar";
import { useProfile } from "../Stores/userStore";

export function Avatarplaceholder(name: string) {
  return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`;
}
const Profile: React.FC = () => {
  const { user, profile } = useGlobals();
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );
  const prof = useProfile();
  const [pickAvatar, setPickAvatar] = useState(false);

  const photo = usePhoto();
  const history = useHistory();
  const uid = getAuth().currentUser?.uid;
  const hundleActiveState = () => {
  prof.setStatus(profile?.status==="active" ? "inactive":"active")
  }

  return (
    <Page>
      <IonContent fullscreen>
        <div className={"flex flex-col items-center justify-center m-5"}>
    
          <ProfileAvatar
            url={profile?.photoURL ?? Avatarplaceholder(profile?.name ?? "s t")}
            onClick={() => {}}
          />
          <IonPopover trigger="click-trigger" triggerAction="click">
            <IonContent class="ion-padding">
             
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
          <IonButton onClick={() => history.push("/driverapplication")}>
            {TT("Register As Driver")}
          </IonButton>
        </div>
        <div>
          {profile?.role === "driver" && (
            <div>
              <IonButton onClick={() => history.push("/driverapplication")}>
                {TT("edit driver information")}
              </IonButton>
              <IonButton onClick={hundleActiveState}>{TT("active")}</IonButton>
            </div>
          )}
        </div>
        <IonList>
          <IonItem>
            <IonIcon icon={personCircleOutline} />
            <IonInput
              slot={"end"}
              value={profile?.name || "Name"}
              disabled={true}
              onIonChange={(e) => {
                // mydb.updateProfile({ name: e.detail.value! });
              }}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} />
            <IonInput
              slot={"end"}
              value={profile?.email}
              disabled={true}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonIcon icon={phonePortraitOutline} />
            <IonInput
              slot={"end"}
              value={profile?.phoneNumber}
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
