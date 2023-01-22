import * as React from "react";
import "react-select-search/style.css";
import GeoPointPicker from "../../components/GeoPointPicker";

const Step1: React.FC<{ onFinish: (v: any) => void }> = ({ onFinish }) => {
  const [pickUpLocation, setPickUpLocation] = React.useState<any>();
  const [dropLocation, setDropLocation] = React.useState<any>();

  return (
    <div className={'w-full h-full'}>
       
      <GeoPointPicker onValueSet={(c)=>{}} placeHolder='Choose Pick up Point' />

    </div>
  );
};
export default Step1;
