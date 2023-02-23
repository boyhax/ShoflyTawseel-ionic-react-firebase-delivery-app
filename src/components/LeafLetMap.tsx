import { Geolocation } from "@capacitor/geolocation";
import { IonFab, IonFabButton, IonIcon, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { locate, locateSharp, mapSharp } from "ionicons/icons";
import L, { LatLng } from "leaflet";
import {
  OpenStreetMapProvider,
  GoogleProvider,
  GeoSearchControl,
} from "leaflet-geosearch";
import { ProviderParams } from "leaflet-geosearch/dist/providers/provider";
import { Store } from "pullstate";
import * as React from "react";
import { useState } from "react";
import { Config } from "../config";

const mapsStore = new Store({
  mapsCount:0,
})
type props = {
  onMap: (map: L.Map) => void;
  locateButton?: boolean;
  searchButton?: boolean;
  layerButton?: boolean;
  centerPin?: boolean;
  id?:string,
};
export const LeafLetMap: React.FC<props> = ({
  locateButton,
  searchButton,
  layerButton,
  centerPin,
  onMap,
  children,
  id
}) => {
  let current_lat = 23.588;
  let current_long = 58.3829;
  let current_zoom = 16;
  let center_lat = current_lat;
  let center_long = current_long;
  let center_zoom = current_zoom;
  const [map, setMap] = useState<L.Map>();
  const [state, setstate] = useState(0);
  const stateref = React.useRef(state);
  const [tailLayer, setTailLayer] = useState<L.TileLayer>();
  const{mapsCount} = mapsStore.useState(s=>s)
  var layerNow = "street";
  
  React.useEffect(() => {
    const map = L.map(`map${id??''}`, {
      center: [center_lat, center_long],
      zoom: center_zoom,
      zoomControl: false,
    });
    mapsStore.update(s=>{s.mapsCount+=1})
    setMap(map);
    onMap(map);

   

    const tailLayer = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    ).addTo(map);
    setTailLayer(tailLayer);

    map.setView(new L.LatLng(center_lat, center_long), center_zoom);
    const provider = new GoogleProvider({
      region: "OM",
      language: "ar",
      apiKey: Config().mapApiKey!,
    });

    if (searchButton) {
      const searchControl = GeoSearchControl({
        provider: provider,
        showMarker: false, // optional: true|false  - default true
        searchLabel: "search address", // optional: string      - default 'Enter address'
      });
      map.addControl(searchControl);
      map.on("geosearch/showlocation", (e) => {
        console.log("geoSearch", e);
      });
    }
    return()=>{
      if (map) {
        map.off();
        mapsStore.update(s=>{s.mapsCount=s.mapsCount-1})
      }
    }
  },[]);
  React.useEffect(() => {
    if (map) {
      map.invalidateSize(true);
      stateref.current += 1;
    }
  });
  function moveCameraTo(pos: Pick<LatLng, "lat" | "lng">) {
    if (map) {
      map.flyTo(pos);
    }
  }
  function toggleMapType() {
    //     Note the difference in the "lyrs" parameter in the URL:
    // Hybrid: s,h;
    // Satellite: s;
    // Streets: m;
    // Terrain: p;
    const streetUrl = "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    const SatelliteUrl = "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
    if (map && tailLayer) {
      tailLayer.setUrl(layerNow === "street" ? streetUrl : SatelliteUrl);
      layerNow = layerNow === "street" ? "Satellite" : "street";
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
      id={`map${id||''}`}
      style={{
        display: "inline-block",
        overflow: "hidden",
        background: "#ddd",
        outlineOffset: "1px",
        width: "100%",
        height: "100%",
      }}
    >
      <div className=" flex absolute w-full h-full pointer-events-none z-[1000]">
        {children}
        
        <IonFab horizontal={"start"} vertical={"bottom"}>
          {layerButton&& <IonFabButton
            size={"small"}
            className={"pointer-events-auto my-2  "}
            onClick={toggleMapType}
          >
            <IonIcon icon={mapSharp} />
          </IonFabButton>}
          {locateButton &&<IonFabButton
            size={"small"}
            className={"pointer-events-auto my-2  "}
            onClick={selfLocate}
          >
            <IonIcon icon={locateSharp} />
          </IonFabButton>}
        </IonFab>
      </div>
    </div>
  );
};
