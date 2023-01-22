import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserApplications from "../hooks/useUserApplications";


export default function UserApplicationsList(props: any) {
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [listMessage, setListMessage] = useState<any>(null)
  const orders = useUserApplications()



  function Refresh() {
  }
  



  
  return <div>
    


    <IonList  >

    <IonRefresher
      ref={IonRefresherElement}
      slot="fixed"
      onIonRefresh={Refresh} >
      <IonRefresherContent
        refreshingText="refreshing..."></IonRefresherContent>
    </IonRefresher>
    {orders.userApplications &&

      orders.userApplications.docs.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <div >
          {JSON.stringify(v.data())}
        </div>
      })
    }
    {orders.loading && !orders.userApplications && <OrdersPlaceHolder></OrdersPlaceHolder>}

    

    </IonList>

   
    
  </div>
}



