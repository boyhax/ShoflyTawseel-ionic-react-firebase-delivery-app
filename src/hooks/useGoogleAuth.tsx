import { useState, useEffect } from "react";

import { Camera, CameraResultType, Photo } from '@capacitor/camera';

import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { setUserImage } from "../providers/firebaseMain";
import { getLang } from "../App";

export function useGoogleAuth() {

  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  auth.languageCode = getLang();
  const signin = ()=>{
    
    return  signInWithPopup(auth,provider)
    .then((result) => {
      if(!result){return}
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
  return {signin}
  
}
