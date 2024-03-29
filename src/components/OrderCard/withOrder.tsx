import {
  IonSkeletonText,
  IonCard,
} from "@ionic/react";
import { doc } from "firebase/firestore";
import React, {  } from "react";
import OrderCard from ".";
import useGetDoc from "../../hooks/useGetDoc";
import mydb, { db } from "../../api/firebaseMain";
import { orderProps } from "../../types";
import NewOrderView from "./NewOrderModal";
import NewOrderModal from "./NewOrderModal";

import "./OrderCard.css";

export default function OrderCardWithOrder({
  id,
}: {id:string}): React.ReactElement {

  const {data,loading,error,getData}=useGetDoc(doc(db, "orders/" + id))
  
  if(!data && (loading || error)){
    return(
      <IonCard className={'h-32'}><IonSkeletonText className={'h-32'} ></IonSkeletonText></IonCard>
    )
  }
  return(
    <div>

    {data && <NewOrderView order={{...data!.data() as orderProps,id:data!.id}}/>}
    </div>

  );
}
