import {
  IonButton,
  IonIcon,
  IonItem,
} from "@ionic/react";
import { location as locationIcon } from "ionicons/icons";
import { LatLng, Map,marker } from "leaflet";
import React, { useEffect, useState } from "react";
import GoogleSearchAutoComplete from "./GoogleSearchAutoComplete";
import { LeafLetMap } from "./utlis/LeafLetMap";
import { PenIcon } from "./utlis/leafletMapIcons";

interface Props extends React.ThHTMLAttributes<Element> {
  placeHolder: string;
  onValueSet: (value: LatLng) => void;
}

const GeoPointPicker = ({ placeHolder, onValueSet }: Props) => {
  const [value, setValue] = useState<LatLng>();

  const [map, setMap] = useState<Map>();
  useEffect(() => {
    if(map){
      const m :any= marker(map.getCenter(),{
        icon:PenIcon
      }).addTo(map)
      map.on('move',function(e){
        m.setLatLng(map.getCenter());
      });
    }
  }, [map]);

  function submit() {
    map && onValueSet(map.getCenter());
    map && setValue(map.getCenter());
  }

  return (
    <div className={"w-full h-full "}>
      
      <LeafLetMap onMap={setMap}>
        <div className={"pointer-events-none flex  flex-col w-full h-full"}>
        
      
          <div className={`
            pointer-events-auto z-[2000] flex w-full justify-center items-center  mt-auto  place-self-end`}>
            <IonButton onClick={submit}>{placeHolder}</IonButton>
          </div>
        </div>
      </LeafLetMap>
    </div>
  );
};
export default GeoPointPicker;
