import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
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

  const auth = getAuth()
  auth.languageCode = getLang()
  const { user, presentAlert } = useGlobals()
  const history = useHistory()


  useEffect(() => {
    setVerificationId(null)
  }, [phoneNumber])




  async function sendVerifyNumber() {
    if (String(phoneNumber).length !== 8) {
      return 1
    }
    setVerifyError(undefined);
    setVerifyInProgress(true);
    setVerificationId('');
    setRecaptchaVerified(false)
    document.getElementById("recaptcha-container")!.innerHTML = ""

    const recaptchaVerifier = new RecaptchaVerifier(
      `recaptcha-container`,
      {
        size: "normal",
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit(response);
        }
      },
      auth
    );
    const onSignInSubmit = (v: any) => {
      setRecaptchaVerified(true)
    }
    await signInWithPhoneNumber(
      auth,
      PhoneCode + phoneNumber,
      recaptchaVerifier
    ).then((v) => {
      setVerificationId(v.verificationId)
      setVerifyError({ message: "تم ارسال الكود بنجاح" });
      verificationCodeTextInput!.current!.focus();
      setVerifyInProgress(false);

    }, (err) => {
      setVerifyError(err);
      setVerifyInProgress(false);
    })


  }

  async function VerifyNumber() {
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
    <div >

        <IonItem style={{width: '200px'}}>
          <IonLabel position='floating'>Phone Number</IonLabel>
          <IonInput maxlength={8} type='tel' 
          onIonChange={(e) => setPhoneNumber(e.detail.value!)}>
          </IonInput>
          <IonButton 
          fill={'clear'}
          onClick={() => { sendVerifyNumber() }}
            disabled={String(phoneNumber).length < 8}>
              <span style={{fontSize:'2rem'}}>
                Send
              {/* <IonIcon size='large' icon={arrowForwardCircle}></IonIcon> */}

              </span>
          </IonButton>
        </IonItem>
        <IonLabel>{verifyError?.message!}</IonLabel>
        {!!verificationId && <IonContent>
          <IonItem >
            <IonLabel position='floating'> one time code</IonLabel>
            <IonInput
              ref={verificationCodeTextInput}
              maxlength={8}
              // type=''
              autocomplete='one-time-code'
              onIonChange={(e) => setVerificationCode(e.detail.value!)}>
            </IonInput>
            {confirmInProgress ?
              <IonSpinner></IonSpinner>
              :
              <IonButton 
              fill={'clear'}
              onClick={() => { VerifyNumber() }}
              disabled={String(verificationCode).length < 1}>
              <span style={{fontSize:'2rem'}}>
                    Submit   
                  </span>
              </IonButton>}

          </IonItem>
          <IonLabel>{confirmError?.message!}</IonLabel>
        </IonContent>}
        {!verificationId &&

          <div className='center' id='recaptcha-container' ></div>}

    </div>
  );
};

export default PhoneAuth