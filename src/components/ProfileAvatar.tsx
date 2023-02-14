import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonAvatar, IonImg } from "@ionic/react";
import { getAuth } from "firebase/auth";
import * as React from "react";
import { mydb } from "../providers/firebaseMain";

export const b64toBlob = (b64Data:any, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
export default function ProfileAvatar(props: {
  url: string;
  onClick: ( url:string) => void;
}) {
    const hundleimage = async() => {
      try {
        const imageData = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          webUseInput: true,
          height: 200,
          width: 200,
          correctOrientation: true,
          presentationStyle: "popover",
        });
        console.log(imageData);
        // const res = await fetch(imageData.path!);
        // const blob = await res.blob();
        const blob = b64toBlob(imageData.base64String!);

        console.log(blob);
        let file = new File([blob], `${mydb.user?.uid}.jpg`, {
          type: blob.type,
        });
        console.log(file);
        const url = await mydb.uploadFile(file);
        mydb.updateProfile({ photoURL: url });
        props.onClick(url);
        return url;
      } catch (error) {
        console.log('error :>> ', error);
      }
        
      }
  return (
    <IonAvatar>
      <IonImg
        onClick={hundleimage}
        src={props.url}
      ></IonImg>
    </IonAvatar>
  );
}

