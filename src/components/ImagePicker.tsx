import React, { useState } from "react";

import {
  IonImg,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export default function ImagePicker(props: {path64data?:string,onChange?:(path64data:string)=>void,clearButton?:boolean}) {
  const {path64data, getImage} = useImage();

  return (
    <div className={'w-full h-full'}  onClick={()=>getImage().then(v=>{props.onChange&&v&& props.onChange(v)})}>
      {path64data && (
        <img className={'rounded-xl  h-full'} alt="imasssge" src={`data:image/jpeg;base64,${path64data}`} />
      )}
      {!path64data && <IonSkeletonText />}
    </div>
  );
}
function useImage() {
  const [path64data, setpath64data] = useState("");
  const getImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    setpath64data(image.base64String ?? "");
    return image.base64String;
  };

  return {path64data, getImage};
}
