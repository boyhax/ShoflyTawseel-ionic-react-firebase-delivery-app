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
  IonNote,
} from "@ionic/react";
import {
  golfOutline,
  logOutOutline,
  mailOutline,
  personCircleOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { useGlobals } from "../providers/globalsProvider";
import { getAuth } from "firebase/auth";
import { avatarPLaceholder, mydb, updateUserProfile } from "../providers/firebaseMain";
import { TT} from "../components/utlis/tt";
import CreatProfile from "./CreatProfile";
import AvatarPicker from "../components/AvatarPicker";
import { useHistory } from "react-router";
import { usePhoto } from "../hooks/usePhoto";
import Page from "../components/Page";
import ProfileAvatar from "../components/ProfileAvatar";
import { useDriver, useProfile, userStore } from "../Stores/userStore";
import { DriverStatus } from "../types";


const Account: React.FC = () => {
  const { user, profile,driver } = userStore.useState(s=>s);
  const [content, setContent] = useState<"orders" | "deliver" | "editProfile">(
    "orders"
  );


  const photo = usePhoto();
  const history = useHistory();
  const hundleActiveState = () => {
  driver &&mydb.updateDriver({status:driver.status==="active"?DriverStatus.inactive:DriverStatus.active})
  }
  return (
    <Page homeButton>

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
          
        <div>
          {driver && (
            <IonItem>
              <IonButton fill={'clear'} onClick={() => history.push("/driverapplication")}>
                {TT("edit driver information")}
              </IonButton>
              </IonItem>
          )}
          {!driver && (
            <IonItem>
              <IonButton fill={'clear'} onClick={() => history.push("/driverapplication")}>
                {TT("Register As Driver")}
              </IonButton>
              </IonItem>
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
          {driver && driver.status==="pending" &&<IonNote color={'success'}>{TT('Your Application under review thank you for your patiency.🎕')}</IonNote>}
          {driver && driver.status==="banned" &&<IonLabel color={'danger'} >{TT('OOBS you are banned sorry.contact us if you want to know more.🙁')}</IonLabel>}

       {driver && <IonItem>
            <IonIcon icon={golfOutline} />
            <IonLabel>{TT('status')}</IonLabel>
            <IonNote slot={'end'}>{TT(DriverStatus[driver.status])}</IonNote>

            <IonToggle
            disabled={["pending","banned"].includes(driver.status)?true:false}
            slot={"end"}
              checked={driver.status==="active"?true:false}
              onIonChange={hundleActiveState}
            ></IonToggle>
          </IonItem>}
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

