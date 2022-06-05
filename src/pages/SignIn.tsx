import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { arrowForwardCircle, home } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential,RecaptchaVerifier,signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../providers/globalsProvider';
import { createNewProfile, getProfile } from '../providers/firebaseMain';

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
    const [ui,setUi] = useState<any>(null)
    const auth= getAuth()
    const {user} = useGlobals()
    const createProfileModal = useRef<any>(null)
    useEffect(()=>{
      var ui = new firebaseui.auth.AuthUI(getAuth());
      setUi(ui)
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
      
        await getProfile(auth.currentUser!.uid).then((data)=>{
          const exist = data.exists()
          if (!exist){
            createProfile()
          }
        },(error)=>{
          console.log('error :>> ', error);
        })
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
      createProfileModal.current!.present()
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
          auth.languageCode = "ar"
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
        // ui!.start('firebaseui-auth-container', {
        //   signInOptions: [
        //     {
        //       provider: EmailAuthProvider.PROVIDER_ID,
        //       requireDisplayName: false
        //     }
        //   ]
        // });
        
        
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>تسجيل الدخول </IonTitle>
          <IonButton slot='end' href='/'><IonIcon icon={home}></IonIcon></IonButton>
        </IonToolbar>
      </IonHeader>
      {/* <IonItem id='firebaseui-auth-container'></IonItem> */}
      
{!verificationId &&       <IonItem id='recaptcha-container' ></IonItem>
}
        <IonModal ref={createProfileModal} > 
          <IonContent>
            <IonTitle>
              ادخل معلوماتك
            </IonTitle>
            <IonItem>
              <IonLabel position='floating' >الاسم</IonLabel>
              <IonInput 
              placeholder='الاسم'
              onIonChange={(e)=>setName(e.detail.value)}></IonInput>
            </IonItem>
            <IonButton onClick={()=>onCreateProfileSubmit()}>Submit</IonButton>
          </IonContent>
        </IonModal>
      <IonContent className='container'>
        {/* {verificationId !==null && 
        <IonItem 
        onClick={(e) => { setVerificationId(""); setPhoneNumber(""); } } 
        fill={undefined} shape={undefined} counter={undefined} 
        counterFormatter={undefined} >
          <IonLabel>تغيير الرقم</IonLabel>
          </IonItem>} */}
          
          {!user && <div><IonItem className='input' fill={undefined} shape={undefined} 
          counter={undefined} counterFormatter={undefined} > 
              <IonLabel position='floating'>رقم الهاتف</IonLabel>
        <IonInput  maxlength={8}  type='tel'  onIonChange={(e)=>setPhoneNumber(e.detail.value!)}>
            </IonInput>
            <IonButton slot='end'  size='default' onClick={()=>{sendVerifyNumber()}} 
            disabled={String(phoneNumber).length<8 }>
            <IonIcon size='large' icon={arrowForwardCircle}></IonIcon></IonButton>
        </IonItem>
        <IonLabel>{verifyError?.message!}</IonLabel></div>}

        {!!verificationId && <div>
          <IonItem className='input' ref={verificationCodeTextInput} 
          fill={undefined} shape={undefined} counter={undefined} 
          counterFormatter={undefined} >
              <IonLabel position='floating'> OTB الرمز السري</IonLabel>
        <IonInput  maxlength={8} disabled={!verificationId} type='number'  
        onIonChange={(e)=>setVerificationCode(e.detail.value!)}>
            </IonInput>
            <IonButton slot='end' size='default' onClick={()=>{VerifyNumber()}} 
            disabled={String(verificationCode).length<1}>
            <IonIcon size='large' icon={arrowForwardCircle}></IonIcon>
            </IonButton>
        </IonItem>
        <IonLabel>{confirmError?.message!}</IonLabel>
        </div>}
    {user && <IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined} >
      <IonTitle slot='start'>تم تسجيل الدخول</IonTitle>
      <IonButton slot='start' onClick={()=>onSignOut()}>خروج</IonButton>
      </IonItem>}
      </IonContent>
    </IonPage>
  );
};

export default SignIn