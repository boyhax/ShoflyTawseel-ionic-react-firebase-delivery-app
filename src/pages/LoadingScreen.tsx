import React from 'react';
import { IonBackButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent, IonSpinner, IonList, IonCard, IonCardContent, IonCardTitle } from '@ionic/react';
import { useParams } from 'react-router';
interface Props {
  onClose:()=>void,
}
const LoadingScreen: React.FC<Props> = ({onClose}) => {
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {/* <IonBackButton defaultHref="/tab2" /> */}
          </IonButtons>
          <IonTitle onClick={()=>onClose()}>ابدا</IonTitle>
          {/* <IonTitle>Detail</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonCard>
            <IonCardTitle>
            تطبيق شوفلي توصيل يرحب بك
            </IonCardTitle>
            {/* <IonCardContent>
            </IonCardContent> */}
          </IonCard>
          
          <IonCard>
            <IonCardTitle>
              معلومات عن تطبيق شوفلي توصيل
            </IonCardTitle>
            <IonCardContent>
    تطبيق شوفلي توصيل يساعدك في الوصول السريع الى اي شخص يريد توصيل اي غرض 
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardTitle>
        المرسل
            </IonCardTitle>
            <IonCardContent>
  اضف معلومات طلبك للتوصيل عبر زر بلس في القائمة الرئيسية
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardTitle>
        المرسل
            </IonCardTitle>
            <IonCardContent>
  ابحث في الصفحة الرئيسية عن الطلبات التي تناسب وجهتك وموقع انطلاقك واختر التواصل بلواتساب او الرسائل النصية
            </IonCardContent>
          </IonCard>
        </IonList>

        {/* <IonTitle>Loading...</IonTitle>
        <IonSpinner></IonSpinner> */}
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
