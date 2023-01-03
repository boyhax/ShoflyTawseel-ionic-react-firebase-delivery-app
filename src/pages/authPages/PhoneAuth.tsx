import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonNote, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { arrowBack, arrowForwardCircle, home, returnUpBack } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier, signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../../providers/globalsProvider';
import { getProfile, profileExist } from '../../providers/firebaseMain';
import { StyledFirebaseAuth, FirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router';
import AuthHeader from './AuthHeader';
import { getLang } from '../../App';


const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<any>(null)
  const verificationCodeTextInput: any = useRef();
  const [verificationId, setVerificationId] = useState<any | String>("");
  const [verificationCode, setVerificationCode] = useState<any>();
  const [verifyError, setVerifyError] = useState<any>();
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [confirmError, setConfirmError] = useState<any | {}>();
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const [RecaptchaVerified, setRecaptchaVerified] = useState(false)
  const [PhoneCode, setPhoneCode] = useState("+968")
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>()
  useEffect(() => {
    const newRecaptchaVerifier = new RecaptchaVerifier(
      `recaptcha-container`,
      {

        size: "normal",
        'callback': (response:any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onRecaptchaSolved(response);
          console.log('auth response :>> ', response);
        }
      },
      auth
    );
    setRecaptchaVerifier(newRecaptchaVerifier)

    
  }, []);

  const auth = getAuth()
  auth.languageCode = getLang()
  const { user, presentAlert } = useGlobals()
  const history = useHistory()


  useEffect(() => {
    setVerificationId(null)
  }, [phoneNumber])

  const hundleSubmitNumber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendVerifyNumber()

  }
  
  
  async function sendVerifyNumber() {

    setVerifyError(undefined);
    setVerifyInProgress(true);
    setVerificationId('');
    setRecaptchaVerified(false)
    document.getElementById("recaptcha-container")!.innerHTML = ""
    setStep(1)
    signin()

    
  }
  const onRecaptchaSolved = (v: any) => {
    setRecaptchaVerified(true)
    setStep(2)
  }
  async function signin(){

    return await signInWithPhoneNumber(
      auth,
      PhoneCode + phoneNumber,
      recaptchaVerifier
    ).then((v) => {
      setVerificationId(v.verificationId)
      setVerifyError({ message: "تم ارسال الكود بنجاح" });
      verificationCodeTextInput!.current!.focus();
      setVerifyInProgress(false);
      setStep(1)


    }, (err) => {
      setVerifyError(err);
      setVerifyInProgress(false);
      setStep(0)

    })
    
  }

  async function VerifyOTBNumber() {
    try {
      setConfirmError(undefined);
      setConfirmInProgress(true);
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      await signInWithCredential(getAuth(), credential).then((v) => {
        setConfirmInProgress(false);
        setVerificationId('');
        setVerificationCode('');
        presentAlert({
          message: 'Signed in Successfully',
          onDidDismiss: () => { },

        })
        setConfirmError({ message: "تم التسجيل بنجاح" });
      }, (err) => {
        setConfirmError(err);
        setConfirmInProgress(false);
      })


    } catch (err) {

    }
  }
  


  return (
    <div  >
      {/* number step */}

      <div
       hidden={step !== 0}
       >

        <form onSubmit={hundleSubmitNumber}  >

          <IonItem >
            <IonLabel position='floating'>Phone Number</IonLabel>
            <IonInput minlength={8} type='tel'
              required
              value={phoneNumber}
              onIonChange={(e) => setPhoneNumber(e.detail.value!)}>
            </IonInput>

          </IonItem>
          <IonButton
            fill={'clear'}
            type="submit"
            // onClick={() => { sendVerifyNumber() }}
            disabled={String(phoneNumber).length < 8}>
            <span style={{ fontSize: '2rem' }}>
              Send
              {/* <IonIcon size='large' icon={arrowForwardCircle}></IonIcon> */}

            </span>
          </IonButton>
          <IonNote>{verifyError?.message!}</IonNote>

        </form>
      </div>

      {/* recaptcha step */}
      <div 
      hidden={step !== 1}
       className='center' id='recaptcha-container' ></div>

      {/* otp  step */}

      <div hidden={step !== 2} >
        <IonItem >
          <IonLabel position='floating'> one time code</IonLabel>
          <IonInput
            required
            ref={verificationCodeTextInput}
            maxlength={8}
            inputMode='numeric'
            type='number'
            autocomplete='one-time-code'
            onIonChange={(e) => setVerificationCode(e.detail.value!)}>
          </IonInput>

          <IonLoading isOpen={confirmInProgress}></IonLoading>

          {!confirmInProgress &&

            <IonButton
              fill={'clear'}
              onClick={() => { VerifyOTBNumber() }}
              disabled={String(verificationCode).length < 3}>
              <span style={{ fontSize: '2rem' }}>
                Submit
              </span>
            </IonButton>}

        </IonItem>
        <IonNote>{confirmError?.message!}</IonNote>
      </div>


    </div>
  );
};

export default PhoneAuth