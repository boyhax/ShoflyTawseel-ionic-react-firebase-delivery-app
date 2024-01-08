import { IonFabButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, {  } from "react";

interface Step{
  title:string,
  number:number
}
interface Props extends React.ThHTMLAttributes<Element> {
  steps:Step[],
  currentStep:number,
  ifChange:(v:number)=>void,
  onGoBack:(v:number)=>void
}

const StepperCounter = ({steps,currentStep,ifChange,onGoBack}: Props) => {
  
  return<div className={'flex bg-transparent items-center justify-evenly w-fit'}>
   {currentStep !==0 && <IonFabButton 
    key={'title'}
    onClick={()=>onGoBack(currentStep-1)}
    size={'small'}
    className={`mx-2  text-center align-middle  `}
    >
      <IonIcon icon={arrowBack}/>
    </IonFabButton>}
   {steps.map((value) => {
    return<IonFabButton 
    key={value.title}
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


