import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonPopover,
  IonTitle,
} from "@ionic/react";
import "./SignIn.css";
import {
  GoogleAuthProvider,
  getAuth,
  PhoneAuthProvider,
} from "firebase/auth";
import PhoneAuth from "./PhoneAuth";
import EmailAuth from "./EmailAuth";
import GoogleSignin from "./GoogleSignin";
import "./styles.css";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import useOnline from "../../hooks/useOnline";
import { FirebaseAuth } from "react-firebaseui";
import { phonePortraitSharp } from "ionicons/icons";

const SignIn: React.FC = () => {
  const { isOnline } = useOnline();
  const googleAuth = useGoogleAuth();
  const [phoneSignin, setPhoneSignin] = useState(false);
  const [method, setMethod] = useState<"email" | "phone" | "google" | "main">(
    "email"
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
    <IonPage style={{ display: "block" }}>
      <IonContent hidden={!isOnline} className="md:w-[450]">
        <IonCard>
          <IonCardTitle className={"ion-padding"}>Welcome</IonCardTitle>
          <IonCardContent>
            {method === "phone" && <PhoneAuth></PhoneAuth>}

            {method === "email" && <EmailAuth></EmailAuth>}
            {method === "google" && <GoogleSignin></GoogleSignin>}
          </IonCardContent>
          <div
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

            {/* <IonButton
              shape={"round"}
              color={"danger"}
              onClick={() => hundleAuth("google")}
            >
              <IonIcon icon={logoGoogle}></IonIcon>
            </IonButton>  */}
            {/* <FirebaseAuth
              uiConfig={{
                // Popup signin flow rather than redirect flow.
                signInFlow: "popup",
                
                // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
                // signInSuccessUrl: "/signedIn",
                // We will display Google and Facebook as auth providers.
                signInOptions:[
                //   {provider:PhoneAuthProvider.PROVIDER_ID,
                //   defaultCountry:'OM',
                // recaptchaParameters:{
                //   type: 'image', // 'audio'
                //   size: 'invisible', // 'invisible' or 'compact'
                //   badge: 'bottomleft', //' bottomright' or 'inline' applies to invisible.
                
                // }},
                  GoogleAuthProvider.PROVIDER_ID,
                  
                ],
                
              }}
              firebaseAuth={getAuth()}
            /> */}
          </div>
        </IonCard>
      </IonContent>

      <IonPopover
        className={" m-auto rounded-sm shadow-sm"}
        isOpen={phoneSignin}
        onDidDismiss={() => setPhoneSignin(false)}
      >
        <PhoneAuth></PhoneAuth>
      </IonPopover>
    </IonPage>
  );
};

export default SignIn;
