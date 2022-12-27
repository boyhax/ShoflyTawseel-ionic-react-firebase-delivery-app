import { IonPage, IonFab, IonFabButton, IonIcon, IonContent, IonCard, IonLabel, IonTitle, IonImg, IonItem, IonCheckbox, IonTextarea, IonFooter, IonButton, IonLoading } from '@ionic/react';
import { closeSharp, arrowForwardOutline } from 'ionicons/icons';
import * as React from 'react';
import { useNewOrder, useOrderContext } from '.';
import { OrderCatagories } from '../../types';

const Step2:React.FC=(props)=>{
    const order = useNewOrder()

    return <div>
    <IonPage >
    <IonFab style={{ left: '10px', top: '10px' }}>
      <IonFabButton color={'light'} onClick={() => order.stepBack()}>
        <IonIcon color={'primary'} icon={closeSharp} />
      </IonFabButton>
    </IonFab>
    <IonContent style={{ top: '60px' }}>
      <IonCard style={{ display: 'flex', justifyContent: 'center', justifyItems: 'space-between' }} >
        {/* pick up point */}
        <div>
          <IonLabel
            position={'floating'}>Pick up point</IonLabel>
          <IonTitle
            // onClick={() => setLocationsConfirmed(false)}
            >
            {/* {pickUpSearchValue} */}
          </IonTitle>
        </div>
        {/* drop point */}
        <IonIcon style={{ verticalAlign: 'middle', padding: '4px' }} size={'large'} icon={arrowForwardOutline}></IonIcon>
        <div>
          <IonLabel position={'floating'}>Drop point</IonLabel>
          <IonTitle
            // onClick={() => setLocationsConfirmed(false)}
            >
            {/* // {dropSearchValue} */}
          </IonTitle>
        </div>
      </IonCard>
      <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'center', alignItems: 'space-evenly' }}>
        {OrderCatagories && OrderCatagories.map((value, index, array) => {
          return <div
            // onClick={() => setOrderCatagory(value.value)}
            key={index}
            style={{
              margin: '5px', width: '60px',
              height: 'auto',
              borderRadius: '10px',
              border: '5px',
              // backgroundColor: orderCatagory === value.value ?
              //   "var(--ion-color-primary)" : "var(--ion-color-light)"
            }}>

            <IonImg style={{ flex: 1, }} src={value.icon} />
            <IonLabel
              style={{ fontSize: '0.7em' }}
            >{value.name}</IonLabel>
          </div>
        })}
      </div>

      <div>
        <IonItem>
          <IonLabel >Is it Urgent? </IonLabel>
          <IonCheckbox placeholder={'Is Order Urgent?'} 
          value={order.urgent} onIonChange={() => { order.setUrgent(!order.urgent) }}>
          </IonCheckbox>
        </IonItem>

        <IonCard>
          <IonTextarea
            // onIonChange={v => setComment(v.detail.value!)}
            placeholder={"Please write any discreption.. "}>
          </IonTextarea>
        </IonCard>
      </div>

    </IonContent>


    <IonFooter style={{ display: "flex", justifyContent: 'center' }}>
      <IonButton shape={'round'}
        // disabled={!orderCatagory || !isLocationsConfirmed || !OrderDate || isSubmitingOrder}
        // onClick={() => {
        //   onSubmitOrder()
        // }}   
        >
         <IonLoading 
         isOpen={order.loading} 
         message={'Sending Order..'} ></IonLoading>
        Submit Order 👍
      </IonButton>
    </IonFooter>
  </IonPage>
    </div>
}
export default Step2