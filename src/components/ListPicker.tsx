import { IonBadge, IonButton, IonCardHeader, IonChip, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";

type dataProps={
    value:string,
    key:string
}
type Props={
data:dataProps[],
placeHolder:string,
value:string|null,
onValueSet:(value:string|null)=>void
}
const ListPicker=(props:Props)=>{
    const {data} = props
    const [searchValue,setSearchValue] = useState<null|string>(null)
    const [isOpen,setIsOpen] = useState(false)
    const modal:any = useRef(null)

    useEffect(()=>{

    },[isOpen])
    function onOpen(){
      setIsOpen(false)
      modal.current!.present()
  }
    function onClose(){
        setIsOpen(false)
        modal.current!.dismiss()
    }

    return<IonChip color="success" onClick={()=>onOpen()}>
        
        <IonTitle>{props.placeHolder}{props.value}</IonTitle>
        
    <IonModal ref={modal}  isOpen={isOpen} canDismiss={true}  breakpoints={[0.5, 0.85]}
          initialBreakpoint={0.85} onDidDismiss={()=>onClose()}> 
    <IonItem>
            <IonLabel>{props.placeHolder}</IonLabel>
          <IonChip color="success">
              <IonLabel>{props.value}</IonLabel>
              <IonIcon icon={closeCircle} 
              onClick={()=>{props.onValueSet(null)}}/>

              </IonChip>
          <IonInput placeholder="أبحث..."  onIonChange={(e)=>{setSearchValue(e.detail.value!)}}></IonInput>
          <IonChip color="danger" onClick={(e)=>onClose()}>Close</IonChip>
          
        </IonItem>
        
        <IonContent>
      <IonList>{data.map((value:dataProps, index:Number) => 
      {
        if(value.value >= (searchValue !== null?searchValue:"")){
            return <IonItem 
            style={{
                backroundColor:value.value === props.value?"red":"white",
                borderWeidth:5,
                color:value.value === props.value?"red":"black"
            }}
            key={value.key} 
            onClick={()=>{props.onValueSet(value.key);onClose()}}>{value.value}</IonItem>
      }
        })}</IonList>
      
      </IonContent>
      </IonModal>
      {/* <IonIcon icon={closeCircle} 
              onClick={()=>{props.onValueSet(null)}}/> */}
    </IonChip>
}
export default ListPicker


