import { IonBadge, IonButton, IonCardHeader, IonChip, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import { closeCircle, removeCircleOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import "./ListPicker.css"
type dataProps={
    value:string,
    key:string
}
type Props={
data:dataProps[],
placeHolder:string,
value:string|null,
onValueSet:(value:{value:string,key:string}|undefined)=>void
}
const ListPicker=(props:Props)=>{
    const {data} = props
    const [searchValue,setSearchValue] = useState<null|string>(null)
    const [isOpen,setIsOpen] = useState(false)
    const modal:any = useRef(null)

    useEffect(()=>{})
     
    
    function onOpen(){
      setIsOpen(false)
      modal.current!.present()
  }
    function onClose(){
        setIsOpen(false)
        modal.current!.dismiss()
    }

    return<IonChip color="success" onClick={()=>onOpen()}>
        {props.value&& <IonIcon onClick={(e)=>props.onValueSet(undefined)} icon={removeCircleOutline} ></IonIcon>}
        <IonTitle>{props.placeHolder}{props.value}</IonTitle>
        
    <IonModal ref={modal}  isOpen={isOpen} canDismiss={true} 
           onDidDismiss={()=>onClose()}> 
      <IonItem>
            <IonLabel>{props.placeHolder}</IonLabel>
          <IonChip
           color="success">
              <IonLabel>{props.value ||"     "}</IonLabel>
              <IonIcon icon={closeCircle} 

              onClick={()=>{props.onValueSet(undefined)}}/>

              </IonChip>
          <IonInput  placeholder="أبحث..."  onIonChange={(e)=>{setSearchValue(e.detail.value!)}}></IonInput>
          <IonChip color="danger" onClick={(e)=>onClose()}>Close</IonChip>
          
        </IonItem>
        
        <IonContent>
      <IonList>{data.sort((a,b) => {
        const A:string = a.value;
        const B:string = b.value;
        return B.indexOf(searchValue||"")!-A.indexOf(searchValue||"")!
      }).map((value:dataProps, index:Number) => 
      {
            return <IonItem 
            color={value.value === props.value?'primary':'light'}
            key={value.key} 
            onClick={()=>{props.onValueSet(value);onClose()}}>{value.value}</IonItem>
      
        })}</IonList>
      
      </IonContent>
      </IonModal>
      
    </IonChip>
}
export default ListPicker


