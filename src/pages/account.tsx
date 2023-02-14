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
  IonHeader,
  IonToolbar,
  IonToggle,
  IonLabel,
} from "@ionic/react";
import {
  logOutOutline,
  mailOutline,
  personCircleOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { useGlobals } from "../providers/globalsProvider";
import { getAuth } from "firebase/auth";
import { avatarPLaceholder, mydb, updateUserProfile } from "../providers/firebaseMain";
import { TT } from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import AvatarPicker from "../components/AvatarPicker";
import { useHistory } from "react-router";
import { usePhoto } from "../hooks/usePhoto";
import Page from "../components/Page";
import ProfileAvatar from "../components/ProfileAvatar";
import { useDriver, useProfile } from "../Stores/userStore";


const Account: React.FC = () => {
  const { user, profile } = useGlobals();
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );
  const driver = useDriver();
  const [pickAvatar, setPickAvatar] = useState(false);

  const photo = usePhoto();
  const history = useHistory();
  const uid = getAuth().currentUser?.uid;
  const hundleActiveState = () => {
  driver.toggleStatus()
  }
  return (
    <Page closebutton>

      <IonContent fullscreen>
    <IonToolbar className={'flex h-28 items-end'}>
    <ProfileAvatar
            url={profile?.photoURL ?? avatarPLaceholder(profile?.name ?? "s t")}
            onClick={() => {}}
          />
            <IonButtons slot={'end'}>
          <IonButton>
            {TT("Save")}
          </IonButton>
        </IonButtons>
    </IonToolbar>
          
          
       
          {profile?.role !== 'driver' && <IonButton  onClick={() => history.push("/driverapplication")}>
            {TT("Register As Driver")}
          </IonButton>}
        <div>
          {profile?.role === "driver" && (
            <div>
              <IonButton onClick={() => history.push("/driverapplication")}>
                {TT("edit driver information")}
              </IonButton>
              <IonButton onClick={hundleActiveState}>{
              profile.status ==='active'?TT("active"):TT("inactive")}</IonButton>
            </div>
          )}
          {profile?.role === "admin" && (
            <div>
              <IonButton onClick={() => history.push("/admin")}>
                {TT("Admin Page")}
              </IonButton>
             
            </div>
          )}
        </div>
        <IonList>
        <IonItem>
            <IonIcon icon={personCircleOutline} />
            <IonLabel>{TT('status')}</IonLabel>
            <IonToggle
            slot={"end"}
              checked={profile?.status==="active"?true:false??false}
              onIonChange={hundleActiveState}
            ></IonToggle>
          </IonItem>
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
              {/* <IonButton
                onClick={() =>
                  content !== "editProfile"
                    ? setContent("editProfile")
                    : setContent("orders")
                }
              >
                {TT("edit")}
              </IonButton> */}
              <IonButton
              fill={'clear'}
                color={"danger"}
                onClick={() => {
                  getAuth().signOut();
                }}
              >
                {TT("logOut")}
                <IonIcon icon={logOutOutline}></IonIcon>
              </IonButton>
      </IonContent>
    </Page>
  );
};

export default Account;

