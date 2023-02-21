import { IonButton, IonButtons, IonFabButton, IonIcon } from "@ionic/react";
import {
  arrowBack,
  locateSharp,
  locationSharp,
  pinSharp,
  readerSharp,
} from "ionicons/icons";
import React from "react";

const OrdersSteps: React.FC<{
  step: number;
  onStepClick: (step: number) => void;
}> = ({ step, onStepClick }) => {
  return (
    <div
      className={
        " absolute z-[1000] w-26 bg-[var(--ion-color-primary)] bg-white rounded-tr-3xl rounded-br-3xl py-6 top-9 left-0 flex flex-col  px-1 bg-transparent items-center justify-evenly w-fit"
      }
    >
      <div
        className={
          "flex flex-col text-4xl gap-y-8 bg-inherit bg-white gab-6"
        }
      >
        
        <IonIcon onClick={()=>onStepClick(0)} color={step===0?`light`:`secondary`}  icon={locationSharp} />
        <IonIcon onClick={()=>onStepClick(1)} color={step===1?`danger`:`secondary`} icon={pinSharp} />
        <IonIcon onClick={()=>onStepClick(2)} color={step===2?`light`:`secondary`} icon={readerSharp} />
      </div>
    </div>
  );
};
export default OrdersSteps;
