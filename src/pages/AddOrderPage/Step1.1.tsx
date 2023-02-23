import * as React from "react";
import "react-select-search/style.css";
import { updateFromTo, updateGeo, updateStep } from ".";
import GeoPointPicker from "../../components/GeoPointPicker";
import { LatLng } from "leaflet";
import { GeoPoint } from "firebase/firestore";
import { TT } from "../../components/utlis/tt";

const StepTo: React.FC = (props) => {

  async function updatePoint(point:LatLng){
    updateGeo({to:new GeoPoint(point.lat,point.lng)});
    updateFromTo(false,point);
    updateStep(2)
  }
  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker 
      onValueSet={updatePoint} 
      placeHolder={TT('DropHere')} />

    </div>
  );
};
export default StepTo;
