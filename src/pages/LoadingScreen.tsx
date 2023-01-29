import React from "react";
import { IonPage, IonLoading, IonContent } from "@ionic/react";
import { TT } from "../components/utlis/tt";
import "./LoadingScreen.css";
import Page from "../components/Page";
interface Props {
  onClose?: () => void;
}
const LoadingScreen: React.FC<Props> = ({ onClose }) => {
  return (
    <div className={'w-screen h-screen'} >
      <IonContent fullscreen>
        <div className={"flex z-[1000] flex-col gap-6 justify-center items-center w-full h-full"}>
          <div className={"cube "}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            
          </div>
          <div >
          <p className={'text-xl  '}>{TT("Shofly Tawseel")}</p>
          </div>
          

        </div>
      </IonContent>

      {/* <IonLoading isOpen={true} message={TT("Please Wait")}/> */}
    </div>
  );
};

export default LoadingScreen;
