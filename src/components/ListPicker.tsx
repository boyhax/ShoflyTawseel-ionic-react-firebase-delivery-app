import { IonBadge, IonButton, IonCardHeader, IonChip, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
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
onValueSet:(value:string|null)=>void
}
const ListPicker=(props:Props)=>{
    const {data} = props
    const [searchValue,setSearchValue] = useState<null|string>(null)
    const [isOpen,setIsOpen] = useState(false)
    const modal:any = useRef(null)

    useEffect(()=>{
     
    },[])
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
        
    <IonModal ref={modal}  isOpen={isOpen} canDismiss={true} 
           onDidDismiss={()=>onClose()}> 
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
      <IonList>{data
      .sort((a,b) => {
         const A = a.value;
         const B = b.value;
        var an = A.indexOf(searchValue?searchValue:"");
        var bn = B.indexOf(searchValue?searchValue:"");
        if(an === bn)
          return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0);
        else
          return  an > bn ? 1 : -1;
        
          }).map((value:dataProps, index:Number) => 
      {
            return <IonItem 
            
            className={value.value === props.value?"optionActive":"option"}
            key={value.key} 
            onClick={()=>{props.onValueSet(value.key);onClose()}}>{value.value}</IonItem>
      
        })}</IonList>
      
      </IonContent>
      </IonModal>
      
    </IonChip>
}
export default ListPicker


