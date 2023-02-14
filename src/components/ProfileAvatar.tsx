import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { IonAvatar, IonImg } from "@ionic/react";
import { getAuth } from "firebase/auth";
import * as React from "react";
import { mydb } from "../providers/firebaseMain";

export default function ProfileAvatar(props: {
  url: string;
  onClick: ( url:string) => void;
}) {
    const hundleimage = async() => {
        const imageData = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          saveToGallery: true,
          webUseInput: true,
          height: 200,
          width: 200,
          correctOrientation: true,
          presentationStyle: "popover",
        });
        console.log(imageData);
        const res = await fetch(imageData.webPath!);
        const blob = await res.blob();
        console.log(blob);
        let file = new File([blob], `${mydb.user?.uid}-avatar.png`, {
          type: blob.type,
        });
        console.log(file);
        const url = await mydb.uploadFile(file);
        mydb.updateProfile({ photoURL: url });
        props.onClick(url);
        return url;
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

