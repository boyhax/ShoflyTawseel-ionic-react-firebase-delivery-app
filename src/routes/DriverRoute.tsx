import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonLabel, useIonRouter } from "@ionic/react";
import * as React from "react";
import { useHistory } from "react-router";
import Page from "../components/Page";
import { TT } from "../components/utlis/tt";
import { useDriver } from "../hooks/useDriver";

export default function DriverRoute({ children }: any): JSX.Element {
  const { driver } = useDriver();
  const router = useIonRouter();
  let goDriverApplication = React.useCallback(()=>router.push('driverapplication'),[])
  if (!driver) {
    return (
      <Page menubutton>
        <IonContent fullscreen  >
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {TT('Welcome To Our App')}
              </IonCardTitle>
              <IonCardSubtitle>
                {TT("Do you Want To Register As Driver with us?")}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            <IonButton onClick={goDriverApplication} >{TT("Yes")}</IonButton>
            </IonCardContent>
          </IonCard>
          
        </IonContent>
      </Page>
    );
  }
  if (driver && driver.status === "pending") {
    return (
      <Page menubutton>
        <IonContent fullscreen >
           <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {TT('Welcome To Our App')}
              </IonCardTitle>
              <IonCardSubtitle>
                {TT("your application still being verfied thank you for patience")}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            </IonCardContent>
          </IonCard>
          
          
        </IonContent>
      </Page>
    );
  }
  if (driver && driver.status === "banned") {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          className={"flex flex-col items-center justify-start"}
        >
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {TT('Oops!')}
              </IonCardTitle>
              <IonCardSubtitle>
                {TT("It looks tjat you are banned from our system if you think this is a mistake please contact us")}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            <IonButton onClick={()=>router.push('contact')} >{TT("chat now")}</IonButton>
            </IonCardContent>
          </IonCard>
          
        </IonContent>
      </Page>
    );
  }
  return <>{children}</>;
}
