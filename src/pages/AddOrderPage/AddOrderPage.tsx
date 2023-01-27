import * as React from "react";

import { IonLoading, useIonToast } from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { uploadNewOrder } from "../../providers/firebaseMain";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useHistory } from "react-router";
import Page from "../../components/Page";
import { newOrderStore, useNewOrder } from ".";
import StepperCounter from "../../components/StepperCounter";
import StepTo from "./Step1.1";
import { useEffect } from "react";
import { newOrderProps } from "../../types";

const AddOrderPage: any = (props: any) => {
  const { order, loading, step,reset } = useNewOrder();
 useEffect(()=>{
  reset()
 },[])
  
  const stepsComponents = [
    <Step1 />,
    <StepTo />,
    <div className={'pt-24 w-full'}>
      <Step2 />
    </div>,
  ];
  return (
    <Page>
      <div
        className={`absolute w-full h-12 mt-6 
         flex z-[1000] justify-center items-center`}
      >
        <StepperCounter
          steps={[
            { title: "pick up location", number: 0 },
            { title: "drop location ", number: 1 },
            { title: "details ", number: 2 },
          ]}
          currentStep={step}
          ifChange={(v) => {
            // newOrderStore.update(s=>{ s.step = v} )
          }}
          onGoBack={(v) => {
            newOrderStore.update(s=>{ s.step = v} )
          }}
        />
      </div>

      <div className={" flex w-full h-full"}>{stepsComponents[step]}</div>

      <IonLoading isOpen={loading} message={"Making new order.."}></IonLoading>
    </Page>
  );
};

export default AddOrderPage;
