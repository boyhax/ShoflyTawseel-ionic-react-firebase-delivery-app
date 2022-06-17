import { IonInput, IonItem, IonLabel } from "@ionic/react";
import React, { useRef, useState } from "react";

const Input=(props:{check?:(e:string)=>boolean , title:string,placeHolder:string,onChange:(value:string)=>void})=>{
    const[value,setValue] = useState<any>(null)
    const inputRef = useRef<any>(null)
    function onChange(e:string){
            if (props.check!){
                if(props.check(e)){
                    props.onChange(e)
                    inputRef.current!.value = e
                }
                
            }else{
                    props.onChange(e)
                    inputRef.current!.value = e
        }
    }
    return<IonItem>
        <IonLabel position="floating">{props.title}</IonLabel>
        <IonInput 
        ref={inputRef} 
        placeholder={props.placeHolder} 
        onIonChange={(e)=>onChange(e.detail.value!)}
        value={"value"}
        ></IonInput>
    </IonItem>
    
}
export default Input