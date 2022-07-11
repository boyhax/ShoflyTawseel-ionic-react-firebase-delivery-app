import React from 'react';
import { IonBackButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import { useParams } from 'react-router';
import OrderCard from '../components/OrderCard';

const Details: React.FC = () => {
  const parms = useParams()
  // console.log('parms :>> ', parms);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>معلومات عن تطبيق شوفلي توصيل</IonTitle>
          
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
              نبذه سريعة
            </IonCardTitle>
            <IonCardContent>
    تطبيق شوفلي توصيل يساعدك في الوصول السريع الى اي شخص يريد توصيل اي غرض 
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardTitle>
      صاحب الغرض
            </IonCardTitle>
            <IonCardContent>
  اظغط زر الزائد في الصفحه الرئيسية 
  بعدها حدد من الولايه التي تريد ارسال الغرض منها والى اي ولاية 
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardTitle>
        المندوب
            </IonCardTitle>
            <IonCardContent>
  ابحث في الصفحة الرئيسية عن الطلبات التي تناسب وجهتك وموقع انطلاقك واختر التواصل بلواتساب او الرسائل النصية
            </IonCardContent>
          </IonCard>
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Details;
