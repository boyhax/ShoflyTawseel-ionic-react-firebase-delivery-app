import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge} from "@ionic/react";
import React from "react";
export const OrderProps={
id:String,
name:String,
from:String,
to:String,
uid:String,
}
interface props extends ComponentProps{
values:typeof OrderProps
}
export default ({values}:props)=>{
return<IonCard>
    
    <IonCardTitle>{String(values.name)}</IonCardTitle>
    <IonCardContent><IonCardContent style={{flexdirection:"row"}}><IonTitle slot="start" >من</IonTitle>
    <IonTitle slot="start" >{values.from}</IonTitle></IonCardContent></IonCardContent>

</IonCard>
}