import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForwardCircle, home, returnUpBack } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential,RecaptchaVerifier,signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../../providers/globalsProvider';
import {  getProfile, profileExist } from '../../providers/firebaseMain';
import { StyledFirebaseAuth,FirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router';


const SignIn: React.FC = () => {
    const [phoneNumber,setPhoneNumber]=useState<any>(null)
    const verificationCodeTextInput = useRef(null);
    const [verificationId, setVerificationId] = useState<any|String>("");
    const [verificationCode, setVerificationCode] = useState<any>();
    const [verifyError, setVerifyError] = useState<any>();
    const [verifyInProgress, setVerifyInProgress] = useState(false);
    const [confirmError, setConfirmError] = useState<any|{}>();
    const [confirmInProgress, setConfirmInProgress] = useState(false);
    const[RecaptchaVerified,setRecaptchaVerified] = useState(false)
    const [name,setName] = useState<null|string|any>(null)
    const auth= getAuth()
    auth.languageCode = "ar"
    const {user} = useGlobals()
    const history = useHistory()
    useEffect(()=>{
    },[])
    useEffect(()=>{
      if(user){
        onSignIn()
      }
    },[user])
    useEffect(()=>{
      setVerificationId(null)
      // document.getElementById("recaptcha-container")!.innerHTML
          },[phoneNumber])
    
    async function onSignIn(){
          history.push("/")
        
    }
    
    
    async function  sendVerifyNumber(){
      if(String(phoneNumber).length !== 8){
        console.log("phone numbers <8")
        return 1
      }
          setVerifyError(undefined);
          setVerifyInProgress(true);
          setVerificationId('');
          setRecaptchaVerified(false)
            document.getElementById("recaptcha-container")!.innerHTML=""

          const recaptchaVerifier = new RecaptchaVerifier(
            `recaptcha-container`,
            {
              size: "normal",
              'callback': (response:any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onSignInSubmit(response);
              }
            },
            auth
          );
          const onSignInSubmit=(v:any)=>{
              setRecaptchaVerified(true)
          }
           await signInWithPhoneNumber(
            auth,
            "+968"+phoneNumber,
             recaptchaVerifier
          ).then((v)=>{
            setVerificationId(v.verificationId) 
            setVerifyError({message:"تم ارسال الكود بنجاح"});
            // verificationCodeTextInput? verificationCodeTextInput!.current!.focus():()=>{};
            setVerifyInProgress(false);

          },(err)=>{
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
          const cred = await signInWithCredential(getAuth(),credential).then((v)=>{
            setConfirmInProgress(false);
            setVerificationId('');
            setVerificationCode('');
            alert('تم تاكيد التسجيل بنجاح');
            setConfirmError({message:"تم التسجيل بنجاح"});
            onSignIn()
          },(err)=>{
            setConfirmError(err);
            setConfirmInProgress(false);
          })
          
          
        } catch (err) {

        }
        }
        // ui.start('#firebaseui-auth-container', uiConfig);

        
  return (
    <IonPage>
        <IonToolbar color="secondary">

        <IonButtons slot="start">
    <IonBackButton defaultHref='/'></IonBackButton>
    </IonButtons>
    <IonTitle slot='primary' onClick={()=>history.push("/home")}  
    >ShoflyTawseel
    </IonTitle>
    
  </IonToolbar>
      
        
      <IonContent className='container'>
       
          
          {!user && <IonContent>
           
            <IonItem className='input' fill={undefined} shape={undefined} 
          counter={undefined} counterFormatter={undefined}  > 
              <IonLabel position='floating'>رقم الهاتف</IonLabel>
        <IonInput  maxlength={8}  type='tel'  onIonChange={(e)=>setPhoneNumber(e.detail.value!)}>
            </IonInput>
            <IonButton slot='start'  size='default' onClick={()=>{sendVerifyNumber()}} 
            disabled={String(phoneNumber).length<8 }>
            <IonIcon size='large' icon={arrowForwardCircle}></IonIcon>
            </IonButton>
        </IonItem>
        <IonLabel>{verifyError?.message!}</IonLabel>
        {!!verificationId && <IonContent>
          <IonItem className='input' ref={verificationCodeTextInput} 
          fill={undefined} shape={undefined} counter={undefined} 
          counterFormatter={undefined} >
              <IonLabel position='floating'> OTB الرمز السري</IonLabel>
        <IonInput  
        maxlength={8} 
        disabled={!verificationId} 
        type='number'
        inputMode='numeric'
        autocomplete='one-time-code' 
        onIonChange={(e)=>setVerificationCode(e.detail.value!)}>
            </IonInput>
            {confirmInProgress?
            <IonSpinner></IonSpinner>
            :<IonButton slot='start' size='default' onClick={()=>{VerifyNumber()}} 
            disabled={String(verificationCode).length<1}>
            <IonIcon size='large' icon={arrowForwardCircle}></IonIcon>
            </IonButton>}
            
        </IonItem>
        <IonLabel>{confirmError?.message!}</IonLabel>
        </IonContent>}
        {!verificationId &&    
           <div className='center' id='recaptcha-container' ></div>}
      </IonContent>}
    
      </IonContent>
    </IonPage>
  );
};

export default SignIn