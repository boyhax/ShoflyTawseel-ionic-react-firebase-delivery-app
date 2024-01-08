import { Geolocation } from "@capacitor/geolocation";
import { IonFab, IonFabButton, IonIcon, useIonToast } from "@ionic/react";
import { locateSharp, mapSharp } from "ionicons/icons";
import L, { LatLng } from "leaflet";
import { GoogleProvider, GeoSearchControl } from "leaflet-geosearch";
import * as React from "react";
import { useState } from "react";
import { Config } from "../config";
import { TT } from "./utlis/tt";

var initialLocation: LatLng | undefined;
async function updateInitialLocation() {
  try {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    });
    initialLocation = new LatLng(pos.coords.latitude, pos.coords.longitude);
  } catch (error) {
    console.debug(error)
  }
}
updateInitialLocation();

type props = {
  onMap: (map: L.Map) => void;
  locateButton?: boolean;
  searchButton?: boolean;
  layerButton?: boolean;
  centerPin?: boolean;
  id?: string;
};
export const LeafLetMap: React.FC<props> = ({
  locateButton,
  searchButton,
  layerButton,
  centerPin,
  onMap,
  children,
  id,
}) => {
  let current_lat =initialLocation?initialLocation.lat: 23.588;
  let current_long =initialLocation?initialLocation.lng: 58.3829;
  let current_zoom = 16;
  let center_lat = current_lat;
  let center_long = current_long;
  let center_zoom = current_zoom;
  const [map, setMap] = useState<L.Map>();
  const [toast] = useIonToast();
  const mapRef = React.useRef(map);
  const [tailLayer, setTailLayer] = useState<L.TileLayer>();
  var layerNow = "street";

  React.useEffect(() => {
    console.log("leaflet map effect :>> ");
    var container = L.DomUtil.get(`map${id ?? ""}`);

    if (mapRef.current) {
      return;
      // container.id = '';
    }
    const map = L.map(`map${id ?? ""}`, {
      center: [center_lat, center_long],
      zoom: center_zoom,
      zoomControl: false,
    }).fitWorld();
    setMap(map);
    onMap(map);

    const tailLayer = L.tileLayer(
      "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        detectRetina: true,
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
    return () => {
      if (map) {
        map.off();
      }
    };
  }, []);
  React.useEffect(() => {
    if (map) {
      map.invalidateSize(true);
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
    try {
      const pos = await Geolocation.getCurrentPosition();

      if (map) {
        moveCameraTo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      }
    } catch (error) {
      const grant = await Geolocation.checkPermissions();
      if (!grant.location) {
        const request = await Geolocation.requestPermissions();
        toast(TT("make sure you have location enabled"), 2000);
      }
      toast(TT("make sure you have location enabled"), 2000);
    }
  }
  return (
    <div
      id={`map${id || ""}`}
      style={{
        display: "inline-block",
        overflow: "hidden",
        background: "#ddd",
        outlineOffset: "1px",
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
    >
      <div className=" flex absolute w-full h-full pointer-events-none z-[1000]">
        {children}

        <IonFab
          horizontal={"start"}
          vertical={"bottom"}
          className={"bottom-12"}
        >
          {layerButton && (
            <IonFabButton
              size={"small"}
              className={"pointer-events-auto my-2  "}
              onClick={toggleMapType}
            >
              <IonIcon icon={mapSharp} />
            </IonFabButton>
          )}
          {locateButton && (
            <IonFabButton
              size={"small"}
              className={"pointer-events-auto my-2  "}
              onClick={selfLocate}
            >
              <IonIcon icon={locateSharp} />
            </IonFabButton>
          )}
        </IonFab>
      </div>
    </div>
  );
};
