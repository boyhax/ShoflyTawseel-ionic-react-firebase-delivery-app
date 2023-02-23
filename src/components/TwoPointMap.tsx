import { useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { clear } from "console";
import L, { LatLng, marker } from "leaflet";
import * as React from "react";
import { useState } from "react";
import { LeafLetMap } from "./LeafLetMap";
import { markerAIcon, markerBIcon, OrderIcon } from "./utlis/leafletMapIcons";

type props = {
  onMap: (map: L.Map) => void;
  children?:any,
  point1:LatLng,
  point2:LatLng,
  id?:string,
};
 export default function TwoPointMap({id,  children,point1,point2 }:props) {
  

  const [map, setMap] = useState<L.Map>();
 useIonViewWillLeave(()=>{
  map && map.remove()
 })
  
  
  function hundleMap(map: L.Map) {
    map.scrollWheelZoom.disable();
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    // map.zoomControl.remove();
    
    setMap(map);
    const m = marker(
      point1,
      { icon: markerAIcon },
      
    ).addTo(map);
    const m2 = marker(
      point2,
      { icon: markerBIcon },
      
    ).addTo(map);
    const bounds = L.featureGroup([m,m2]).getBounds();

    map.fitBounds(bounds,{padding:L.point(5,50)});
    map.on('resize', function(e) {
      map.fitBounds(bounds);
    });
  }
  return (
    <LeafLetMap id={id} onMap={hundleMap} ></LeafLetMap>
  );
};
