import { IonCardSubtitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPopover } from "@ionic/react";
import { caretForwardOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { keyValue } from "../types";
import { Cities, citiesList, getLocationSuggetions } from "./utlis/citiesUtlis";


interface Props extends React.ThHTMLAttributes<Element> {
  placeHolder: string,
  onValueSet: (value: keyValue) => void | undefined,
}
const CitiesEn = Cities('en')

const CityPicker = ({ placeHolder, onValueSet }: Props) => {
  const [options, setOptions] = React.useState<any[]>()
  const [searchValue, setSearchValue] = useState("")

  const [value, setValue] = useState<keyValue>()

  useEffect(() => { 
    updateOptions(searchValue)
  },[searchValue])

  

  const onSearchValue = (v:any)=>{
    setSearchValue(v)
  }
  function updateOptions(text: string) {

    const options = getLocationSuggetions(text,-1)
    // var op: any = []
    // for (let v of options) {
    //   op.push({
    //     address: v.value, name: v.value
    //     , location: { lat: '', lng: '' }
    //     , id: v.key, types: [""]
    //   })
    // }
    setOptions(options)


  }
  const hundlepick=(v:keyValue)=>{
    setValue(v)
    onValueSet(v)
    setSearchValue('')
    updateOptions(v.value)
  }

  return <>
  <IonItem>
    <IonLabel position={'stacked'}>Pick up place</IonLabel>
    <IonInput
      required
      value={(value && value.value ) ||''}
      placeholder={'pick up point'}
      id={placeHolder+'LocationSelector'}>
    </IonInput>
  </IonItem>
    

    

    {/* //list popover */}
    <IonPopover trigger={placeHolder+'LocationSelector'}>
      <IonItem>
        <IonLabel
          position={'floating'}>{placeHolder}</IonLabel>
        <IonInput
          required
          value={ searchValue || (value && value.value) ||""}
          onIonChange={(e)=>onSearchValue(e.detail.value)}>
            
          </IonInput>
      </IonItem>
      <IonContent>

      <IonList inset={true}  >
         
        {options && options.map((v:keyValue, i) => {
          return <IonItem 
          key={i} 
          color={value?value===v?'primary':'default':'default'}
           onClick={()=>hundlepick(v)}>
            <IonIcon size={'small'} color={'secondary'} icon={caretForwardOutline}></IonIcon>

            <div>
              <IonLabel>{v.value}</IonLabel>
              <IonCardSubtitle  >{CitiesEn[Number(v.key)].value}</IonCardSubtitle>
            </div>

          </IonItem>
        })}

      </IonList>
      </IonContent>

    </IonPopover>
  </>
}
export default CityPicker


