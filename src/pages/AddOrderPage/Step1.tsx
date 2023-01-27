import * as React from "react";
import "react-select-search/style.css";
import { newOrderStore } from ".";
import GeoPointPicker from "../../components/GeoPointPicker";
import { LatLng } from "leaflet";
import { GeoPoint } from "firebase/firestore";
const Step1: React.FC = (props) => {
  const { order, loading, step } = newOrderStore.useState();
  
  function updatePoint(point:LatLng){
    
    newOrderStore.update(s=>{s.order = {...s.order,
      geo:{...s.order.geo!, from:new GeoPoint(point.lat,point.lng)},};
      s.step = 1
    })
  }
  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker 
      onValueSet={updatePoint} 
      placeHolder='Choose Pick up Point' />

    </div>
  );
};
export default Step1;
