import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonNote,
  useIonToast,
} from "@ionic/react";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import "./SignIn.css";
import { getLang } from "../../App";
import { TT } from "../../components/utlis/tt";
import { useHistory } from "react-router";
import { phonePortraitOutline, phonePortraitSharp } from "ionicons/icons";
import PhoneInput from "react-phone-input-2";

const PhoneAuth: React.FC = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const verificationCodeTextInput: any = useRef();
  const [verificationId, setVerificationId] = useState<any | String>("");
  const [verificationCode, setVerificationCode] = useState<any>();
  const [verifyError, setVerifyError] = useState<any>();
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [confirmError, setConfirmError] = useState<any | {}>();
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const [RecaptchaVerified, setRecaptchaVerified] = useState(false);
  const [PhoneCode, setPhoneCode] = useState("");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>();
  const [present] = useIonToast();
  const history = useHistory();
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
    setStep(1);
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
    <div className={"pt-[50%]"}>
      {/* number step */}

      <div hidden={step !== 0}>
        <form
          onSubmit={hundleSubmitNumber}
          className={"flex flex-col gap-2 items-center justify-center "}
        >
          <IonItem style={{ direction: "ltr" }}>
            <IonIcon size={"large"} icon={phonePortraitSharp} />

            <IonInput
              placeholder={"+968 8888 8888"}
              // minlength={}
              type="tel"
              required
              // prefix={"+"}
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <div
            className={
              "flex flex-row items-center ltr rounded-full w-[200px] outline-2 outline-blue-600 bg-[var(--ion-color-secondary)] text-center"
            }
          ></div>

          <IonButton
            fill={"clear"}
            type="submit"
            shape={"round"}
            // onClick={() => { sendVerifyNumber() }}
            // disabled={phoneNumber.length < 8}
          >
            <span style={{ fontSize: "2rem" }}>
              Send
              {/* <IonIcon size='large' icon={arrowForwardCircle}></IonIcon> */}
            </span>
          </IonButton>
          <IonNote>{TT(verifyError?.message!||"")}</IonNote>
        </form>
        <div className={" flex flex-col items-center justify-center"}>
          <IonLabel className={"text-center font-sans"}>
            {TT("by sign in you agree to the ")}

            {/* <IonButton fill={"clear"}></IonButton> */}
          </IonLabel>
          <p
            className={"text-xl whitespace-pre-line font-sans"}
            onClick={() => history.push("/AppRulesAndPolicy")}
          >
            {TT("terms and conditions")}
          </p>
        </div>
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

      <form
        hidden={step !== 2}
        onSubmit={(e) => {
          e.preventDefault();
          VerifyOTBNumber();
        }}
        className={"flex flex-col gap-2 items-center  justify-center"}
      >
        <p className={"text-lg text-blue-500"}>one time Password</p>
        <IonItem style={{direction:'ltr'}}>
          <IonInput
            required
            
            placeholder={"enter here.."}
            ref={verificationCodeTextInput}
            maxlength={8}
            inputMode="numeric"
            type="number"
            autocomplete="one-time-code"
            onIonChange={(e) => setVerificationCode(e.detail.value!)}
          ></IonInput>
        </IonItem>

        
          <IonButton
            fill={"clear"}
            type="submit"
            size={'large'}
            shape={"round"}
            disabled={String(verificationCode).length < 3 ||confirmInProgress}
          >
            <span style={{ fontSize: "2rem" }}>Submit</span>
          </IonButton>
        
        <p
          onClick={() => setStep(0)}
          className={"text-base text-[var(--ion-color-primary)]"}
        >
          {TT("Return")}
        </p>

        <IonNote>{TT(confirmError?.message!||"")}</IonNote>
      </form>

      <IonLoading isOpen={confirmInProgress}></IonLoading>
    </div>
  );
};

export default PhoneAuth;
