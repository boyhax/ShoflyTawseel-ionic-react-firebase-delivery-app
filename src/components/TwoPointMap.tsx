import L, { LatLng, marker } from "leaflet";
import * as React from "react";
import { useState } from "react";
import { markerAIcon, markerBIcon, OrderIcon } from "./utlis/leafletMapIcons";

type props = {
  onMap: (map: L.Map) => void;
  children?:any,
  point1:LatLng,
  point2:LatLng,
};
 export default function TwoPointMap({ onMap, children,point1,point2 }:props) {
  

  const [map, setMap] = useState<L.Map>();

  React.useEffect(() => {
    
    var bounds1 = L.latLngBounds([point1,point2]);
    const map = L.map(`map-${point1.lat+point2.lat}`, {
      // maxBounds: bounds,
      zoom: 16,
      center:[23.5880, 58.3829],
      zoomControl: false,
      touchZoom: false,
      scrollWheelZoom:false,
      doubleClickZoom: false,
    });
    setMap(map);
    onMap(map);
    const m = marker(
      point1,
      { icon: markerAIcon },
      
    ).addTo(map);
    const m2 = marker(
      point2,
      { icon: markerBIcon },
      
    ).addTo(map);
    const bounds = L.featureGroup([m,m2]).getBounds();

    map.fitBounds(bounds);
    map.on('resize', function(e) {
      map.fitBounds(bounds);
    });
    
    
    const tailLayer = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    ).addTo(map);
    
    // map.setView(new L.LatLng(center_lat, center_long), center_zoom);
    // // map.fitBounds(new L.LatLngBounds(points));
    

  }, []);
  React.useEffect(() => {
    if (map) {
      map.invalidateSize(true);
    }
  });
  
  return (
    <div
      id={`map-${point1.lat+point2.lat}`}
      style={{
        display: "inline-block",
        overflow: "hidden",
        background: "#ddd",
        outlineOffset: "1px",
        minHeight:'50px',
        minWidth:'70px',
        width: "100%",
        height: "100%",
      }}
    >
      <div className=" flex absolute w-full h-full pointer-events-none z-[1000]">
        
      </div>
    </div>
  );
};
