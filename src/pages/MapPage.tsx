import React, { useEffect, useRef, useState } from "react";
import { IonButton, IonButtons, IonFabButton, IonIcon } from "@ionic/react";
import { locateOutline, locateSharp } from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import useBoundOrders from "../hooks/useBoundOrders";
import { greenIcon, LeafLetMap } from "../components/utlis/LeafLetMap";
import { Map, marker } from "leaflet";
import geoFirestore from "../providers/geofirestore";
import { Store } from "pullstate";

interface _state {
  value: any;
  centerMarker: boolean;
  marker: any;
  oldMarkers: any[];
}
const useBoundOrdersStore = new Store({
  orders: [],
  loading: true,
  setBounds: (b: any) => {},
  update: () => {},
});
const MapPage: React.FC = () => {
  const [map, setMap] = useState<Map>();
  const [_state, _setState] = useState<_state>({
    value: 1,
    centerMarker: false,
    marker: "",
    oldMarkers: [],
  });
  const state = useRef(_state);
  useEffect(() => {
    map && setup();
    return () => unSetup();
  }, [map]);
  function setState(obj: Partial<_state>) {
    state.current = { ...state.current, ...obj };
  }
  // useBoundOrders();
  const { orders, loading, setBounds, update } = useBoundOrders();
  // const { orders, loading, setBounds, update } = useBoundOrdersStore.useState();

  useEffect(() => {
    if (map) {
      if (!orders) {
        return;
      }
      refreshMarkers(
        orders.map((value) => {
          const coord = {
            lat: value.coordinates._lat,
            lng: value.coordinates._long,
          };
          return { coordinate: coord };
        })
      );
    }
  }, [orders]);

  function refreshMarkers(markers: { coordinate: LatLng }[]) {
    clearMarkers();
    setState({ oldMarkers: addMarkers(markers) });
  }

  function addMarkers(markers: { coordinate: LatLng }[]) {
    var list: any[] = [];
    if (!map) {
      return;
    }
    markers.forEach((v) => {
      const m = marker(
        {
          lat: v.coordinate.lat,
          lng: v.coordinate.lng,
        },
        { icon: greenIcon, title: " click to pick order" }
      )
        .addTo(map)
        .addEventListener("click", (e) => {
          console.log("event marker click :>> ", e);
        });
      list.push(m);
    });
    return list;
  }

  function clearMarkers() {
    state.current.oldMarkers.forEach((v) => {
      map?.removeLayer(v);
    });
  }
  function setup() {
    if (!map) {
      return;
    }
    updateBounds();
    map.addEventListener(
      "dragend",
      (data) => {
        updateBounds();
      },
      {}
    );

    map.addEventListener(
      "click",
      (d) => {
        console.log("map click ", d.latlng);
        // geoFirestore.addGeo("asdsdssd", d.latlng, true).then((d) => {
        //   console.log("geo point added  :>> ", d);
        // });
      },
      {}
    );
  }
  function updateBounds() {
    if (!map) {
      return;
    }
    var b = map.getBounds();
    setBounds(b);
    console.log("bounds updated :>> ");
  }

  function unSetup() {
    map && map.remove();
  }
  function moveCameraTo(pos: LatLng) {
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
    <div className={"w-full h h-full"}>
      <LeafLetMap
        onMap={(map) => {
          setMap(map);
        }}
      >
        <div className={"flex flex-col items-center divide-y-4 justify-center "}>
          <IonFabButton
            
            className={"pointer-events-auto   "}
            onClick={selfLocate}
          >
            <IonIcon  icon={locateSharp} />
          </IonFabButton
>
          
        </div>
      </LeafLetMap>

      {/* <GMap
        onMap={setMap}
        controls={
          <div className={" w-full h-full flex pointer-events-none  "}>
            <div
              className={`pointer-events-auto 
            relative justify-center flex flex-col self-center  `}
            >
              <IonButton onClick={selfLocate} shape="round" color="light">
                <IonIcon slot={'icon-only'} color={"primary"} icon={location} />
              </IonButton>
            </div>

            {state.current.centerMarker && (
              <div className={"absolute w-full h-full flex pointer-events-none"}>
                <IonIcon
                  className={`pointer-events-noun m-auto
            text-5xl `}
                  color={"primary"}
                  icon={location}
                />
              </div>
            )}
          </div>
        }
      ></GMap>  */}
    </div>
  );
};

export default MapPage;
