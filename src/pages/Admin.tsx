import React, {  useState } from "react";
import {
  IonContent,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";

import Page from "../components/Page";
import OrderList from "../components/OrderList";
import DriversList from "../components/DriversList";

const AdminPage: React.FC = () => {  

  const [segment,setSegmt] = useState<any>('DriversList')

  return (
    <Page homeButton>
      <IonContent fullscreen>
      <IonHeader translucent mode={'ios'}>
        <IonToolbar>
          <IonSegment onIonChange={(e)=>setSegmt(e.detail.value)}  mode={'ios'} value={segment}>
            <IonSegmentButton value="DriversList">
            DriversList
            </IonSegmentButton>
            <IonSegmentButton value="Orders">
              Orders
            </IonSegmentButton>
          
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      {segment ==='DriversList' && <DriversList/>}
      {segment ==='Orders' && <OrderList/>}
      </IonContent>
    </Page>
  );
};

export default AdminPage;
