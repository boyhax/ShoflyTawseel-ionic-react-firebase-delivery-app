import {
  IonLabel, IonItem, IonList, IonListHeader, IonSkeletonText, IonThumbnail, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonRow, IonAvatar, IonButton, IonIcon
} from "@ionic/react";
import React from "react";
import "./OrderCard.css"


export const OrderPlaceHolder: React.FC = (props) => {

  return <IonCard mode={'ios'}>
    <IonCardHeader>
      <IonCardTitle>
        <IonAvatar>
        <IonSkeletonText animated={true} style={{ 'width': '50px', height: '50px' }}></IonSkeletonText>

        </IonAvatar>
        <IonCardSubtitle>
        <IonSkeletonText animated={true} style={{ 'width': '100px', height: '10px' }}></IonSkeletonText>

      </IonCardSubtitle>
      </IonCardTitle>
    </IonCardHeader>
    <IonCardContent>
      <IonRow className={'flex justify-center justify-evenly'}>
        <IonSkeletonText animated={true} style={{ 'width': '100px', height: '20px' }}></IonSkeletonText>
        <div className={'w-10'} />
        <IonSkeletonText animated={true} style={{ 'width': '100px', height: '20px' }}></IonSkeletonText>

      </IonRow>
      <IonLabel>
        <p>
          <IonSkeletonText animated={true} style={{ 'width': '60%' }}></IonSkeletonText>
        </p>
        <p>
          <IonSkeletonText animated={true} style={{ 'width': '30%' }}></IonSkeletonText>
        </p>
      </IonLabel>
      
    </IonCardContent>
    <IonRow className={'justify-evenly  '}>
      <div className={'rounded-xl  '} >
      <IonSkeletonText animated={true} className={' w-10 h-10 '}></IonSkeletonText>

      </div>
      <div className={'rounded-xl  '} >
      <IonSkeletonText animated={true} className={' w-10 h-10 '}></IonSkeletonText>

      </div>
      <div className={'rounded-xl  '} >
      <IonSkeletonText animated={true} className={' w-10 h-10 '}></IonSkeletonText>

      </div>
    </IonRow>

  </IonCard>

}





const OrdersPlaceHolder: React.FC = (props) => {

  return <IonList>
    
    <OrderPlaceHolder />
    <OrderPlaceHolder />
    <OrderPlaceHolder />
    <OrderPlaceHolder />

  </IonList>

}
export default OrdersPlaceHolder


