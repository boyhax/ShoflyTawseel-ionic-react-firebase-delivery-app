import { IonFabButton } from "@ionic/react";
import React, {  } from "react";

interface Step{
  title:string,
  number:number
}
interface Props extends React.ThHTMLAttributes<Element> {
  steps:Step[],
  currentStep:number,
  ifChange:(v:number)=>void,
}

const StepperCounter = ({steps,currentStep,ifChange}: Props) => {
  
  return<div className={'flex bg-transparent items-center justify-evenly w-fit'}>
   {steps.map((value) => {
    return<IonFabButton 
    onClick={()=>ifChange(value.number)}
    size={currentStep ===value.number?undefined:'small'}
    className={`mx-2  text-center align-middle 
    ${currentStep ===value.number?' text-2xl  translate-y-[-2]':'text-xl'}`}
    >
      {value.number}
      {/* {value.title} */}
    </IonFabButton>
   })}
  </div>
}
export default StepperCounter


