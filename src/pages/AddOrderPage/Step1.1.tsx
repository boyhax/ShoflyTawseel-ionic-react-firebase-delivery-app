import * as React from "react";
import "react-select-search/style.css";
import { newOrderStore } from ".";
import GeoPointPicker from "../../components/GeoPointPicker";
import {geocodeByLatLng} from 'react-google-places-autocomplete';
import { LatLng } from "leaflet";
const StepTo: React.FC = (props) => {
  const { order, loading, step } = newOrderStore.useState();

   function updatePoint(point:LatLng){
    const order = {
      to:point }
    newOrderStore.update(s=>{s.order = {...order,...s.order}
    })
  }
  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker 
      onValueSet={updatePoint} 
      placeHolder='Choose drop Point' />

    </div>
  );
};
export default StepTo;
