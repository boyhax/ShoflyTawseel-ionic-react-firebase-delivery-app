import * as React from "react";

import {
  IonLoading,
  useIonToast,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import {
  uploadNewOrder,
} from "../../providers/firebaseMain";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useHistory } from "react-router";
import Page from "../../components/Page";
import { newOrderStore } from ".";
import StepperCounter from "../../components/StepperCounter";
import StepTo from "./Step1.1";
import { useEffect } from "react";

const AddOrderPage: any = (props: any) => {
  const { order ,loading,step } = newOrderStore.useState();
  const navigate = useHistory();
  const [present] = useIonToast();
  useEffect(() => {
    newOrderStore.update(s=>{s.submit = onSubmit})
  }, []);

  async function onSubmit() {
    newOrderStore.update(s=>{s.loading =true })
    try {
      await uploadNewOrder(order);
      newOrderStore.update(s=>{s.loading =false;s.finish = true} )
      present({ message: "Order submitted seccessfully ", duration: 1000 });
  
      navigate.push("/");
    } catch (error) {
      newOrderStore.update(s=>{s.loading = false} )
  
      present({ message: "Sorry some issue happen.. please try Again" });
    }
  }
  
  const stepsComponents = [
    <Step1  />,
    <StepTo  />,
    <Step2  />,
  ];
  return (
    <Page>
      <div
        className={`absolute w-full h-12 mt-6 
         flex z-[1000] justify-center items-center`}>
        <StepperCounter
          steps={[
            { title: "pick up location", number: 0 },
            { title: "drop location ", number: 1 },
            { title: "details ", number: 2 },
          ]}
          currentStep={step}
          ifChange={(v)=>{
            newOrderStore.update(s=>{ s.step = v} )
          }}
        />
      </div>

      <div className={" flex w-full h-full"}>
        {stepsComponents[step]}
      </div>

      <IonLoading isOpen={loading} message={"Making new order.."}></IonLoading>
    </Page>
  );
};

export default AddOrderPage;
