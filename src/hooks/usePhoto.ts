import { useState, useEffect } from "react";

import { Camera, CameraResultType, Photo } from '@capacitor/camera';

import { getAuth } from "firebase/auth";
import { setUserImage } from "../providers/firebaseMain";

export function usePhoto() {

  const [photo, setPhoto] = useState<UserPhoto>();
  const [loading, setLoading] = useState(false);



  const takePhoto = async () => {
    setLoading(true)

    const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        
        resultType: CameraResultType.Base64
    });

    const fileName = (getAuth().currentUser?.uid ||"photo") + '.jpeg';
    await savePicture(photo, fileName);
    setLoading(false)

    setPhoto({
        filepath:photo.path!,
        webviewPath:''
    });
    
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;
    const blob =b64toBlob(photo.base64String!,`image/${photo.format}`,512) 
    const p  = await setUserImage(blob, fileName)
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    
  };
  
  const deletePhoto = async (photo: UserPhoto) => {
    
    setPhoto(undefined);
  };

  return {
    deletePhoto,
    photo,
    takePhoto,
    loading
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string')
      }
    };
    reader.readAsDataURL(blob);
  });
}
function b64toBlob(b64Data:string, contentType:any, sliceSize:number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      var byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };