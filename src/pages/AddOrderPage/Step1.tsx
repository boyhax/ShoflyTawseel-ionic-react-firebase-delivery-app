import { IonIcon, IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonList, IonButton, IonCardSubtitle, IonCardHeader, IonCardTitle, IonPopover, IonRow } from '@ionic/react';
import { caretForwardOutline, locationOutline } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router';
import SelectSearch, { SelectSearchOption, useSelect } from 'react-select-search';
import { useNewOrder } from '.';
import { getLocationSuggetions } from '../../components/utlis/citiesUtlis';
import { Address } from '../../externalApis/api\'s';
import 'react-select-search/style.css'
import CityPicker from '../../components/CityPicker';

const Step1: React.FC<{ onFinish: (v: any) => void }> = ({ onFinish }) => {

  
  const [pickUpLocation, setPickUpLocation] = React.useState<any>()
  const [dropLocation, setDropLocation] = React.useState<any>()


  return <IonContent>

    <form onSubmit={(e) => {
      e.preventDefault()
      ; onFinish({ to: dropLocation, from: pickUpLocation })
    }}>

      <IonCard>
        <IonCardHeader>

          <IonCardSubtitle>
            Set Drop & Pick up Points
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          {/* Pick point */}
          <CityPicker onValueSet={setPickUpLocation} placeHolder={'Pick up place'}/>
          
          {/* drop point */}
          <CityPicker onValueSet={setDropLocation} placeHolder='Drop place' />
        </IonCardContent>
      </IonCard>


<IonItem slot={'end'} >
<IonButton
slot={'end'}
        className={'flex w-[40%] '}
        shape={'round'}
        type='submit'
        disabled={!dropLocation ||!pickUpLocation}
      >
        Next
      </IonButton>
</IonItem>
      
    </form>

  </IonContent>
}
export default Step1