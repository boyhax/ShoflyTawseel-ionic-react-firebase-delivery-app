import React, { useEffect, useRef, useState } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonNote,
  IonPage,
  IonSpinner,
  IonTab,
  IonTabs,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import {
  arrowBack,
  arrowForwardCircle,
  home,
  returnUpBack,
} from "ionicons/icons";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  initializeAuth,
  browserSessionPersistence,
  browserPopupRedirectResolver,
  EmailAuthProvider,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import "./SignIn.css";
import * as firebaseui from "firebaseui";
import { useGlobals } from "../../providers/globalsProvider";
import { getProfile, profileExist } from "../../providers/firebaseMain";
import { StyledFirebaseAuth, FirebaseAuth } from "react-firebaseui";
import { useHistory } from "react-router";
import AuthHeader from "./AuthHeader";
import { getLang } from "../../App";
import { TT } from "../../components/utlis/tt";

const PhoneAuth: React.FC = (props) => {
  const [phoneNumber, setPhoneNumber] = useState<any>(null);
  const verificationCodeTextInput: any = useRef();
  const [verificationId, setVerificationId] = useState<any | String>("");
  const [verificationCode, setVerificationCode] = useState<any>();
  const [verifyError, setVerifyError] = useState<any>();
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [confirmError, setConfirmError] = useState<any | {}>();
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const [RecaptchaVerified, setRecaptchaVerified] = useState(false);
  const [PhoneCode, setPhoneCode] = useState("+968");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>();
  const [present] = useIonToast();

  useEffect(() => {
    const newRecaptchaVerifier = new RecaptchaVerifier(
      `recaptcha-container`,
      {
        size: "normal",
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onRecaptchaSolved(response);
          console.log("auth response :>> ", response);
        },
      },
      auth
    );
    setRecaptchaVerifier(newRecaptchaVerifier);
  }, []);

  const auth = getAuth();
  auth.languageCode = getLang();

  useEffect(() => {
    setVerificationId(null);
  }, [phoneNumber]);

  const hundleSubmitNumber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendVerifyNumber();
  };

  async function sendVerifyNumber() {
    setVerifyError(undefined);
    setVerifyInProgress(true);
    setVerificationId("");
    setRecaptchaVerified(false);
    signin();
  }
  const onRecaptchaSolved = (v: any) => {
    setRecaptchaVerified(true);
    setStep(2);
  };
  async function signin() {
    return await signInWithPhoneNumber(
      auth,
      PhoneCode + phoneNumber,
      recaptchaVerifier
    ).then(
      (v) => {
        setVerificationId(v.verificationId);
        present({
          message: TT("the code has been send successfully "),
          onDidDismiss: () => {},
          duration: 1000,
          position: "bottom",
        });
        verificationCodeTextInput!.current!.focus();
        setVerifyInProgress(false);
        setStep(1);
      },
      (err) => {
        setVerifyError(err);
        setVerifyInProgress(false);
        setStep(0);
      }
    );
  }

  async function VerifyOTBNumber() {
    try {
      setConfirmError(undefined);
      setConfirmInProgress(true);
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      await signInWithCredential(getAuth(), credential).then(
        (v) => {
          setConfirmInProgress(false);
          setVerificationId("");
          setVerificationCode("");
          present({
            message: "Signed in Successfully",
            onDidDismiss: () => {},
            duration: 1000,
            position: "bottom",
          });
        },
        (err) => {
          setConfirmError(err);
          setConfirmInProgress(false);
        }
      );
    } catch (err) {}
  }

  return (
    <div>
      {/* number step */}

      <div hidden={step !== 0}>
        <form
          onSubmit={hundleSubmitNumber}
          className={"flex flex-col gap-2 items-center justify-center "}
        >
          <p className={"text-lg text-blue-500"}>Phone Number</p>

          <div >
            <IonInput
            className={"rounded-full w-[200px] bg-blue-100 text-center"}
              placeholder={"enter phone number..."}
              minlength={8}
              type="number"
              required
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
            ></IonInput>
          </div>
          <IonButton
            fill={"clear"}
            type="submit"
            // onClick={() => { sendVerifyNumber() }}
            disabled={String(phoneNumber).length < 8}
          >
            <span style={{ fontSize: "2rem" }}>
              Send
              {/* <IonIcon size='large' icon={arrowForwardCircle}></IonIcon> */}
            </span>
          </IonButton>
          <IonNote>{verifyError?.message!}</IonNote>
        </form>
      </div>

      {/* recaptcha step */}
      <div
        className={"flex flex-col gap-2 items-center justify-center "}
        hidden={step !== 1}
      >
        <p className={"text-lg text-blue-500"}>Enter recaptcha</p>

        <div
          className={"flex px-auto items-center justify-center w-full"}
          id="recaptcha-container"
        />
      </div>

      {/* otp  step */}

      <div hidden={step !== 2} 
      className={"flex flex-col gap-2 items-center justify-center"}>
        <p className={"text-lg text-blue-500"}>one time Password</p>

          <IonInput
            required
            className={"rounded-full w-[200px] bg-blue-100 text-center"}
            placeholder={"enter here.."}
            ref={verificationCodeTextInput}
            maxlength={8}
            inputMode="numeric"
            type="number"
            autocomplete="one-time-code"
            onIonChange={(e) => setVerificationCode(e.detail.value!)}
          ></IonInput>
        {!confirmInProgress && (
          <IonButton
            fill={"clear"}
            type="submit"
            onClick={() => {
              VerifyOTBNumber();
            }}
            disabled={String(verificationCode).length < 3}
          >
            <span style={{ fontSize: "2rem" }}>Submit</span>
          </IonButton>
        )}
        <p onClick={()=>setStep(0)}
         className={"text-base text-[var(--ion-color-primary)]"}>
          {TT('Return')}</p>

        <IonNote>{confirmError?.message!}</IonNote>
      </div>
      <IonLoading isOpen={confirmInProgress}></IonLoading>
    </div>
  );
};

export default PhoneAuth;
