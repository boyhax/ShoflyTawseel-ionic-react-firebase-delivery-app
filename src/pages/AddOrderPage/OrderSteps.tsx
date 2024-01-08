import { IonIcon } from "@ionic/react";
import {
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
        " absolute z-[1000] w-26 bg-[var(--ion-color-primary)] bg-white rounded-br-3xl rounded-bl-3xl px-6 top-0 left-22 flex flex-row ltr   items-center justify-evenly w-fit"
      }
    >
      <div
        className={
          "flex flex-row text-4xl gap-x-8 ltr bg-inherit bg-white gab-6"
        }
      >
        <div className={`${step === 0 && "border-b-2 border-white "} `}>
          <IonIcon
            className={""}
            onClick={() => onStepClick(0)}
            color={step === 0 ? `light` : `secondary`}
            icon={locationSharp}
          />
        </div>
        <div className={`${step === 1 && "border-b-2 border-white "} `}>
          <IonIcon
            onClick={() => onStepClick(1)}
            color={step === 1 ? `light` : `secondary`}
            icon={pinSharp}
          />
        </div>

        <div className={`${step === 2 && "border-b-2 border-white "} `}>
          <IonIcon
            onClick={() => {}}
            color={step === 2 ? `light` : `secondary`}
            icon={readerSharp}
          />
        </div>
      </div>
    </div>
  );
};
export default OrdersSteps;
