import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { addCircle, locateOutline, locateSharp } from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
import { LatLng } from "@capacitor/google-maps/dist/typings/definitions";
import useBoundOrders from "../hooks/useBoundOrders";
import {  LeafLetMap } from "../components/utlis/LeafLetMap";
import { Map, marker } from "leaflet";
import geoFirestore from "../providers/geofirestore";
import { Store } from "pullstate";
import { useHistory } from "react-router";
import { greenIcon, OrderIcon } from "../components/utlis/leafletMapIcons";

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
  const history = useHistory()
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
        { icon: OrderIcon, title: " click to pick order" }
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
  
  return (
    <div className={"w-full flex-col h-full"}>
      <LeafLetMap onMap={setMap}>
        <div className={"flex  w-full h-full  "}>
          
          <div className={'flex w-full justify-center self-end'}>
            <IonButton
              className={"pointer-events-auto   "}
              onClick={()=>history.push('addorder')}
            >
              <IonIcon icon={addCircle} />
              Make order
            </IonButton>
          </div>
        </div>
      </LeafLetMap>

    </div>
  );
};

export default MapPage;
