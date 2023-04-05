import { IonContent, IonIcon, IonImg, IonPage, IonTitle } from "@ionic/react";
import { logoStencil, } from "ionicons/icons";
import * as React from "react";
import Page from "../components/Page";
import { TT } from "../components/utlis/tt";
import useOnline from "../hooks/useOnline";

export default function OnlineRequiredRoute(props: {
  children: any;
}): JSX.Element {
  const { isOnline } = useOnline();


  if (isOnline) {
    return props.children
  }

  return (
    <Page>
      <IonContent fullscreen>
        <div className={'flex flex-col justify-center items-center mt-24'}>
        <IonTitle>{TT('internet connection lost')}</IonTitle>
        <IonImg src={require('../assets/offlineIcon.png')}/>
      {/* <IonIcon className={'w-[100px] h-[100px] max-h-md max-w-md'} icon={logoStencil}/> */}
        </div>
      
      </IonContent>
      
    </Page>
  );
}
