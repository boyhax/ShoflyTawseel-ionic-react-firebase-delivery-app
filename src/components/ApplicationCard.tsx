import { ComponentProps } from "@ionic/core";
import {
  IonChip,
  useIonAlert,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import {
  getOrderById,
  mydb,
} from "../providers/firebaseMain";
import { ApplicationProps, userInfo } from "../types";
import OrderCard from "./OrderCard";
import "./OrderCard.css";


interface props extends ComponentProps {
  data: ApplicationProps;

}

const ApplicationCard = ({data}: props) => {

  const [user,setUser] = useState<null|userInfo>(null)
  const [order,setOrder] = useState<null|any>(null)

  

  useEffect(() => {
    mydb.getUserInfo(data.forUser).then((v)=>{
      const d:any = v.data() 
      v.exists() && setUser({...d})
    })
    getOrderById(data.forOrder).then((doc)=>{
      doc.exists() && setOrder({id:doc.id,...doc.data()})
    })
  }, []);
    
  
 
  const [presentAlert] = useIonAlert();

  
  return (
    <div >
      {order &&<OrderCard order={order}/>}
      <div className={'flex '}>
      <IonChip color={'tertiary'}>{'isAccepted : '+(data.isAccepted?'yes':'not yet')}</IonChip>
      <IonChip color={'tertiary'}>{'time Send : '+(new Date(data.timeSend.seconds *1000).toDateString())}</IonChip>
     
    </div>
     
    </div>
  );
};
export default ApplicationCard;
