import { IonButtons, IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";

export const BackButton = () => {
  const router = useIonRouter();
  return (
    <IonButtons>
      <IonButton
        onClick={() =>
          router.canGoBack() ? router.goBack() : router.push("/")
        }
      >
        <IonIcon icon={chevronBack} />
      </IonButton>
    </IonButtons>
  );
};
