import { IonButton, IonContent, IonLabel } from "@ionic/react";
import * as React from "react";
import { useHistory } from "react-router";
import Page from "../components/Page";
import { TT } from "../components/utlis/tt";
import { useDriver } from "../hooks/useDriver";

export default function DriverRoute({ children }: any): JSX.Element {
  const { driver } = useDriver();
  const history = useHistory();

  if (!driver) {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          
        >
          <div className={"w-full h-full flex flex-col items-center justify-center"}>
          <IonLabel >
              {TT("Do you Want To Register As Driver with us?")}
            </IonLabel>
            <IonButton onClick={()=>history.push('driverapplication')}>{TT("Yes")}</IonButton>
          </div>
           
        </IonContent>
      </Page>
    );
  }
  if (driver && driver.status === "pending") {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          className={"flex flex-col items-center justify-start"}
        >
          <div className={"flex h-full justify-center items-center p-6"}>
            <IonLabel className={"text-center self-auto"}>
              {TT(
                "your application still being verfied thank you for patience"
              )}
            </IonLabel>
          </div>
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
          <div className={"flex h-full justify-center items-center p-6"}>
            <IonLabel className={"text-center self-auto"}>
              {TT(
                "your are banned from our system please contact us for more information"
              )}
            </IonLabel>
          </div>
        </IonContent>
      </Page>
    );
  }
  return <>{children}</>;
}
