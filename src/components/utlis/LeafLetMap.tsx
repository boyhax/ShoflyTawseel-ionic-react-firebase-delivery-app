import { Geolocation } from "@capacitor/geolocation";
import { eventMethod } from "@ionic/core/dist/types/utils/overlays";
import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { locateSharp } from "ionicons/icons";
import L, { LatLng } from "leaflet";
import * as React from "react";
import { useState } from "react";

export const greenIcon = L.icon({
  iconUrl: require("../../assets/icons8-user-location-100.png"),
  // shadowUrl: 'leaf-shadow.png',

  iconSize: [50, 50], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
});
type props = {
  onMap: (map: L.Map) => void;
};

export const LeafLetMap: React.FC<props> = ({ onMap, children }) => {
  let current_lat = 23.588;
  let current_long = 58.3829;
  let current_zoom = 16;
  let center_lat = current_lat;
  let center_long = current_long;
  let center_zoom = current_zoom;
  const [map, setMap] = useState<L.Map>();
  const [state,setstate] = useState(0)
  const stateref = React.useRef(state)  
  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    const map = L.map("map", {
      center: [center_lat, center_long],
      zoom: center_zoom,
      zoomControl: false,
    });
    setMap(map);
    onMap(map);

    const osm = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    ).addTo(map);

    map.setView(new L.LatLng(center_lat, center_long), center_zoom);
  }, []);
  React.useEffect(() => {
    if (map) {
      map.invalidateSize(true);
      stateref.current +=1
    }
    
  });
  function moveCameraTo(pos: Pick<LatLng,'lat'|'lng'>) {
    if (map) {
      map.flyTo(pos);
    }
  }
  async function selfLocate() {
    const pos = await Geolocation.getCurrentPosition();
    if (map) {
      moveCameraTo({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    }
  }
  return (
    <div
      id={`map`}
      style={{
        display: "inline-block",
        overflow: "hidden",
        background: "#ddd",
        outlineOffset: "1px",
        width: "100%",
        height: "100%",
      }}
    >
      <div className=' flex absolute w-full h-full pointer-events-none z-[1000]'>
      {children}
      <IonFab horizontal={"start"} vertical={"bottom"}>
            <IonFabButton
              className={"pointer-events-auto   "}
              onClick={selfLocate}
            >
              <IonIcon icon={locateSharp} />
            </IonFabButton>
          </IonFab>
      </div>
    </div>
  );
};
