import React, {  useState } from "react";

import { IonIcon, } from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { imagesSharp } from "ionicons/icons";
import useMounted from "../hooks/useMounted";

export default function ImagePicker(props: {
  onChange?: (path64data: string) => void;
  clearButton?: boolean;
  defaultImgUrl?: string;
}) {
  const { path64data, getImage } = useImage();
  
  return (
    <div
      className={"w-full h-full bg-gray-200"}
      onClick={() =>
        getImage().then((v) => {
          props.onChange && v && props.onChange(v);
        })
      }
    >
      {path64data && (
        <img
          className={"rounded-xl  h-full"}
          alt="imasssge"
          src={`data:image/jpeg;base64,${path64data}`}
        />
      )}
      {!path64data?props.defaultImgUrl?(
        <img
        className={"rounded-xl  h-full"}
        alt="imasssge"
        src={props.defaultImgUrl}
      />
      ):<div className={'flex w-full h-full justify-center items-center  bg-white/30'}>
      <IonIcon icon={imagesSharp} />
    </div>:(
        <div className={'flex w-full h-full justify-center items-center  bg-white/30'}>
          <IonIcon icon={imagesSharp} />
        </div>
      )}
      
    </div>
  );
}
function useImage() {
  const{mounted} = useMounted()
  const [path64data, setpath64data] = useState("");
  const getImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    
    mounted && setpath64data(image.base64String ?? "");
    return image.base64String;
  };

  return { path64data, getImage };
}
