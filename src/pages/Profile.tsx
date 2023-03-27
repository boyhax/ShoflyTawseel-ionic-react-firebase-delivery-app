import React, {  } from "react";
import {
  IonContent,
  IonAvatar,
  IonImg,
  IonToolbar,
} from "@ionic/react";
import { avatarPLaceholder } from "../api/firebaseMain";
import Page from "../components/Page";


const Profile: React.FC = () => {
  
  return (
    <Page>
      
      <IonContent fullscreen>
    <IonToolbar>
    <IonAvatar>
            <IonImg src={avatarPLaceholder('s t')} />
          </IonAvatar>

    </IonToolbar>
          
          
          
      </IonContent>
    </Page>
  );
};

export default Profile;
