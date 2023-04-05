import React from 'react';
import { IonBackButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent, IonList, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import { useParams } from 'react-router';
import Page from '../components/Page';

const Details: React.FC = () => {
  const parms = useParams()
  // console.log('parms :>> ', parms);
  return (
    <Page homeButton>
      <div className={'h-12'}/>
      <IonContent>
        <IonList className={'divide-y-4'}>
            <IonCardTitle className={'m-5'}>
            تطبيق شوفلي توصيل يرحب بك
            </IonCardTitle>
            
          
          <div>
            <IonCardTitle>
              نبذه سريعة
            </IonCardTitle>
            <IonCardContent>
    تطبيق شوفلي توصيل يساعدك في الوصول السريع الى اي شخص يريد توصيل اي غرض 
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>
      صاحب الغرض
            </IonCardTitle>
            <IonCardContent>
  اظغط زر الزائد في الصفحه الرئيسية 
  بعدها حدد من الولايه التي تريد ارسال الغرض منها والى اي ولاية 
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>
        المندوب
            </IonCardTitle>
            <IonCardContent>
  ابحث في الصفحة الرئيسية عن الطلبات التي تناسب وجهتك وموقع انطلاقك واختر التواصل بلواتساب او الرسائل النصية
            </IonCardContent>
          </div>
        </IonList>

      </IonContent>
    </Page>
  );
};

export default Details;
