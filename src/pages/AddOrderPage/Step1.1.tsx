import * as React from "react";
import "react-select-search/style.css";
import { newOrderStore } from ".";
import GeoPointPicker from "../../components/GeoPointPicker";
import { LatLng } from "leaflet";
import { GeoPoint } from "firebase/firestore";
import { geocodeByLatLng } from "react-google-places-autocomplete";

const StepTo: React.FC = (props) => {
  const { order, loading, step } = newOrderStore.useState();

  async function updatePoint(point:LatLng){
    // newOrderStore.update(updateGeo({from:point}))
    var codeResult = await geocodeByLatLng(point)
    var from = codeResult? codeResult[0].formatted_address:''
    newOrderStore.update(s=>{s.order = {...s.order,
      from,
      geo:{...s.order.geo!, to:new GeoPoint(point.lat,point.lng)},};
      s.step = 2
    })
  }
  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker 
      onValueSet={updatePoint} 
      placeHolder='drop here' />

    </div>
  );
};
export default StepTo;
