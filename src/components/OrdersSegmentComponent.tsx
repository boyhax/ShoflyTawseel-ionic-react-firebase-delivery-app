import React, {  } from 'react';
import {
  IonContent,
  IonHeader,
  IonSegment, IonSegmentButton, IonToolbar
} from '@ionic/react';
import 'leaflet/dist/leaflet.css';
import OrderList from '../components/OrderList';
import Page from '../components/Page';



const OrdersSegmentComponent = () => {

  

  return (<div>
      <IonHeader translucent mode={'ios'}>
        <IonToolbar>
          <IonSegment   mode={'ios'} value="all">
            <IonSegmentButton value="all">
              All
            </IonSegmentButton>
            <IonSegmentButton value="favorites">
              Accepted
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      
      <OrderList></OrderList>
      

    </div>
  );
};

export default OrdersSegmentComponent;