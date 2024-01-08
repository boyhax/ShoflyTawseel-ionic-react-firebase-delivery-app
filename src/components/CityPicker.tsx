import { IonCardSubtitle, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPopover } from "@ionic/react";
import { caretForwardOutline, removeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { keyValue } from "../types";
import { Cities, getLocationSuggetions } from "./utlis/citiesUtlis";


interface Props extends React.ThHTMLAttributes<Element> {
  placeHolder: string,
  onValueSet: (value: keyValue| "") => void ,
  clear?:boolean
}
const CitiesEn = Cities('en')

const CityPicker = ({ placeHolder, onValueSet ,clear}: Props) => {
  const [options, setOptions] = React.useState<any[]>()
  const [searchValue, setSearchValue] = useState("")

  const [value, setValue] = useState<keyValue|''>()

  useEffect(() => { 
    updateOptions(searchValue)
  },[searchValue])

  

  const onSearchValue = (v:any)=>{
    setSearchValue(v)
  }
  function updateOptions(text: string) {

    const options = getLocationSuggetions(text,-1)
   
    setOptions(options)


  }
  const hundlepick=(v:keyValue|"")=>{
    setValue(v)
    onValueSet(v)
    setSearchValue('')
    v && updateOptions(v.value)
  }

  return <>
  <IonItem>
    <IonInput
      required
      value={(value && value.value ) ||''}
      placeholder={placeHolder}
      id={placeHolder+'LocationSelector'}>
    </IonInput>
    {clear&& <IonIcon slot={'end'} onClick={()=>hundlepick({key:'',value:''})} icon={removeOutline}/>}
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


