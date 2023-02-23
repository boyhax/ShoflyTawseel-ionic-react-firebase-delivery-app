import * as React from "react";
import "react-select-search/style.css";
import { newOrderStore, updateFromTo, updateGeo, updateStep } from ".";
import GeoPointPicker from "../../components/GeoPointPicker";
import { LatLng } from "leaflet";
import { GeoPoint } from "firebase/firestore";
import { geocodeByLatLng } from "react-google-places-autocomplete";
import { TT } from "../../components/utlis/tt";

const Step1: React.FC = (props) => {
  
  async function updatePoint(point:LatLng){
    updateGeo({from:new GeoPoint(point.lat,point.lng)});
    updateFromTo(true,point);
    updateStep(1)

  }
  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker 
      onValueSet={updatePoint} 
      placeHolder={TT('SetPickUpPoint')} />

    </div>
  );
};
export default Step1;
