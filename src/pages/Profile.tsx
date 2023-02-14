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
  IonToolbar,
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
import { useProfile } from "../Stores/userStore";


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
