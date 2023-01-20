import { IonPage, IonFab, IonFabButton, IonIcon, IonContent, IonCard, IonLabel, IonTitle, IonImg, IonItem, IonCheckbox, IonTextarea, IonFooter, IonButton, IonLoading } from '@ionic/react';
import { closeSharp, arrowForwardOutline } from 'ionicons/icons';
import * as React from 'react';
import { useNewOrder } from '.';
import { uploadNewOrder } from '../../providers/firebaseMain';
import { OrderCatagories } from '../../types';

const Step2: React.FC<{ onFinish: (v: any) => void }> = ({ onFinish }) => {
  const [props,setProps] = React.useState<object|any>({})
  const orderProps = useNewOrder().order
  return <div>
      <form onSubmit={(e)=>{e.preventDefault();onFinish({props})}}>

          <IonCard style={{ display: 'flex', justifyContent: 'center', justifyItems: 'space-between' }} >
            {/* pick up point */}
            <div>
              <IonLabel
                position={'floating'}>Pick up point</IonLabel>
              <IonTitle
              >
                 {orderProps.from.value}
              </IonTitle>
            </div>
            {/* drop point */}
            <IonIcon style={{ verticalAlign: 'middle', padding: '4px' }} size={'large'} icon={arrowForwardOutline}></IonIcon>
            <div>
              <IonLabel position={'floating'}>Drop point</IonLabel>
              <IonTitle
              >
                 {orderProps.to.value}
              </IonTitle>
            </div>
          </IonCard>
          <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'center', alignItems: 'space-evenly' }}>
            {OrderCatagories && OrderCatagories.map((value, index, array) => {
              return <div
                onClick={() => setProps({...props,type:value.value})}
                key={index}
                style={{
                  margin: '5px', width: '60px',
                  height: 'auto',
                  borderRadius: '10px',
                  border: '5px',
                  backgroundColor: props && props.type === value.value ?
                    "var(--ion-color-primary)" : "var(--ion-color-light)"
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
                 onIonChange={(v) => { setProps({urgent:v.detail.value}) }}>
              </IonCheckbox>
            </IonItem>

            <IonCard>
              <IonTextarea
                // onIonChange={v => setComment(v.detail.value!)}
                placeholder={"Please write any discreption.. "}>
              </IonTextarea>
            </IonCard>
          </div>



        <IonFooter style={{ display: "flex", justifyContent: 'center' }}>
          <IonButton shape={'round'}
            type='submit'
          >

            Submit Order 👍
          </IonButton>
        </IonFooter>
      </form>
    
  </div>
}
export default Step2