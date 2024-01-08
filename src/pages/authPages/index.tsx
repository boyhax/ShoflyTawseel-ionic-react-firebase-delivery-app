import React, { useState } from "react";
import {
  IonCardTitle,
  IonContent,
} from "@ionic/react";
import "./SignIn.css";
import PhoneAuth from "./PhoneAuth";
import EmailAuth from "./EmailAuth";
import GoogleSignin from "./GoogleSignin";
import "./styles.css";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import useOnline from "../../hooks/useOnline";
import Page from "../../components/Page";
import { TT } from "../../components/utlis/tt";

const SignIn: React.FC = () => {
  const { isOnline } = useOnline();
  const googleAuth = useGoogleAuth();
  const [phoneSignin, setPhoneSignin] = useState(false);
  const [method, setMethod] = useState<"email" | "phone" | "google" | "main">(
    "phone"
  );

  const hundleAuth = (b: "email" | "phone" | "google" | "main") => {
    if (b === "phone") {
      setPhoneSignin(true);
    }
    if (b === "google") {
      googleAuth.signin();
    }
  };

  return (
    <Page>
      <IonContent >
        <div className={'h-24 bg-[var(--ion-color-primary)] rounded-bl-3xl rounded-br-3xl '}>
        <IonCardTitle className={" text-4xl ion-padding text-white text-center"}>{TT('Welcome')}</IonCardTitle>

        </div>
            {method === "phone" && <PhoneAuth></PhoneAuth>}

            {method === "email" && <EmailAuth></EmailAuth>}
            {method === "google" && <GoogleSignin></GoogleSignin>}
          {/* <div
            className={
              "ion-flex flex-column ion-justify-content-center ion-align-items-center"
            }
          >
            <IonTitle>OR</IonTitle>
          </div>

          <div className={"ion-flex flex-row justify-center align-center"}>
             <IonButton
              id={"phoneSignin"}
              shape={"round"}
              onClick={() => hundleAuth("phone")}
            >
              <IonIcon icon={phonePortraitSharp}></IonIcon>
            </IonButton>

            
          </div>
        </IonCard>
      </IonContent>

      <IonPopover
        className={" m-auto rounded-sm shadow-sm"}
        isOpen={phoneSignin}
        onDidDismiss={() => setPhoneSignin(false)}
      >
        <PhoneAuth></PhoneAuth>
      </IonPopover> */}

      </IonContent>
    </Page>
  );
};

export default SignIn;
