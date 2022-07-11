import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForwardCircle, home, returnUpBack } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential,RecaptchaVerifier,signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../providers/globalsProvider';
import { createNewProfile, getProfile, profileExist } from '../providers/firebaseMain';
import { StyledFirebaseAuth,FirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router';

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    PhoneAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

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
    const createProfileModal = useRef<any>(null)
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
    
      async function getprofile() {
      return await (await getProfile(auth.currentUser!.uid)).data
    }
    async function onSignIn(){
          history.push("/")
        
    }
    function onCreateProfileSubmit(){
      if(typeof name === "string"?name.length >5:false){
          createNewProfile(auth.currentUser?.uid,{
            name:name
          })
      }else{
        alert("يجب ادخال اسم اكبر من 5 حروف")
      }
    }
    function createProfile(){
      // createProfileModal.current!.present()
      return<IonLabel>create pr</IonLabel>
    }
    function onSignOut(){
      auth.signOut()
    }
    
    async function  sendVerifyNumber(){
      if(String(phoneNumber).length !== 8){
        console.log("phone numbers <8")
        return 1
      }
        const phoneProvider = new PhoneAuthProvider(auth);
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
          const onSignInSubmit=(response:any)=>{
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
          const authResult = await signInWithCredential(auth, credential);
          setConfirmInProgress(false);
          setVerificationId('');
          setVerificationCode('');
          alert('تم تاكيد التسجيل بنجاح');
          setConfirmError({message:"تم التسجيل بنجاح"});
          onSignIn()
        } catch (err) {
          setConfirmError(err);
          setConfirmInProgress(false);
        }
        }
       const uiConfig = {
        signInOptions: [
          EmailAuthProvider.PROVIDER_ID,
          {
            provider: PhoneAuthProvider.PROVIDER_ID,
            recaptchaParameters: {
              type: 'image', // 'audio'
              size: 'normal', // 'invisible' or 'compact'
              badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
            },
            defaultCountry: 'OM', // Set default country to the United Kingdom (+44).
            // For prefilling the national number, set defaultNationNumber.
            // This will only be observed if only phone Auth provider is used since
            // for multiple providers, the NASCAR screen will always render first
            // with a 'sign in with phone number' button.
            defaultNationalNumber: '1234567890',
            // You can also pass the full phone number string instead of the
            // 'defaultCountry' and 'defaultNationalNumber'. However, in this case,
            // the first country ID that matches the country code will be used to
            // populate the country selector. So for countries that share the same
            // country code, the selected country may not be the expected one.
            // In that case, pass the 'defaultCountry' instead to ensure the exact
            // country is selected. The 'defaultCountry' and 'defaultNationaNumber'
            // will always have higher priority than 'loginHint' which will be ignored
            // in their favor. In this case, the default country will be 'GB' even
            // though 'loginHint' specified the country code as '+1'.
            loginHint: '+11234567890'
          },
          GoogleAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: '/',

      }
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
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
            <IonButton slot='start' size='default' onClick={()=>{VerifyNumber()}} 
            disabled={String(verificationCode).length<1}>
            <IonIcon size='large' icon={arrowForwardCircle}></IonIcon>
            </IonButton>
        </IonItem>
        <IonLabel>{confirmError?.message!}</IonLabel>
        </IonContent>}
        {!verificationId &&    
           <div className='center' id='recaptcha-container' ></div>}
      </IonContent>}

        
          <IonContent>
          {/* {user && <IonItem fill={'outline'} shape={'round'}  >
      <IonTitle slot='start'>تم تسجيل الدخول</IonTitle>
      <IonButton slot='start' onClick={()=>onSignOut()}>خروج</IonButton>
      </IonItem>} */}
          </IonContent>
    
      </IonContent>
    </IonPage>
  );
};

export default SignIn