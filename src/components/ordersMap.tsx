import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonToolbar,
} from "@ionic/react";
import useBoundOrders from "../hooks/useBoundOrders";
import { LeafLetMap } from "./LeafLetMap";
import { LeafletMouseEvent, marker } from "leaflet";
import { OrderIcon } from "./utlis/leafletMapIcons";
import { geoToLatlng } from "../api/firebaseMain";
import { orderProps } from "../types";
import OrderCardWithOrder from "./OrderCard/withOrder";
import NewOrderView from "./OrderCard/NewOrderModal";
import useNearOrders from "../hooks/useNearOrders";

interface _state {
  value: any;
  centerMarker: boolean;
  marker: any;
  oldMarkers: any[];
  orderId: string;
  map: L.Map | null;
  bounds:L.LatLngBounds|null
}

export default function OrdersMap (props:any) {
  const [clickedOrder, setClickedOrder] = useState<orderProps>();
  const [_state, _setState] = useState<_state>({
    value: 1,
    centerMarker: false,
    marker: "",
    oldMarkers: [],
    orderId: "",
    map: null,
    bounds:null
  });
  const state = useRef(_state);
  const {items,searchNear} = useNearOrders()
  // const [present, dissmis] = useIonModal(modalComponent, {
  //   orderId: state.current.orderId,
  //   onDissmis:()=>dissmis(),
  // });
  useEffect(() => {
    return () => unSetup();
  }, []);

  const { orders, loading, setBounds,update } = useBoundOrders();

  useEffect(() => {
    if (state.current.map) {
      if (!orders) {
        return;
      }
      refreshMarkers(orders);
    }
  }, [orders]);
  useEffect(() => {
    if (state.current.bounds) {
      setBounds(state.current.bounds)
      searchNear([state.current.bounds.getCenter().lat,state.current.bounds.getCenter().lng],200000,5)
    }
  }, [state.current.bounds]);

  function onOrderMarkerClick(
    event: LeafletMouseEvent,
    marker: L.Marker<any>,
    order: orderProps
  ) {
    state.current.orderId = order.id;
    setClickedOrder(order);
  }
  function refreshMarkers(markers: orderProps[]) {
    clearMarkers();
    state.current.oldMarkers = addMarkers(markers)!;
  }

  function addMarkers(markers: orderProps[]) {
    var list: any[] = [];
    if (!state.current.map) {
      return;
    } else {
      markers.forEach((v) => {
        const m = marker(geoToLatlng(v.geo.from), {
          icon: OrderIcon,
          title: " click to pick order",
        })
          .addTo(state.current.map!)
          .addEventListener("click", (e) => {
            onOrderMarkerClick(e, m, v);
          });
        list.push(m);
      });
    }

    return list;
  }

  function clearMarkers() {
    state.current.oldMarkers.forEach((v) => {
      state.current.map!.removeLayer(v);
    });
  }
  function setup(map: L.Map) {
    state.current.map = map;
    setTimeout(() => {
      updateBounds(map);
    }, 100);

    map.on(
      "dragend",
      (data) => {
        console.log("dragend :>> ", data);
        updateBounds(map);
        state.current.bounds = map.getBounds()
      },
      {}
    );
  }
  function updateBounds(map: L.Map) {
    var b = map.getBounds();
    setBounds(b);
    console.debug("bounds updated :>> ");
  }

  function unSetup() {
    state.current.map! && state.current.map!.remove();
  }

  return (
    <div className={"w-full flex-col h-full"}>
      <LeafLetMap id={"mainMap"} onMap={setup} layerButton locateButton>
        <div className={"flex  w-full h-full  "}>
          <div
            className={
              "flex w-full justify-center self-end bg-gradient-to-t from-white via-white to-transparent"
            }
          >
            
            {clickedOrder && (
              <IonCard className={"h-fit h-min-24 w-full pointer-events-auto"}>
                <NewOrderView
                  order={clickedOrder}
                  onCancel={() => setClickedOrder(undefined)}
                  onAccept={() => setClickedOrder(undefined)}
                />
              </IonCard>
            )}
          </div>
        </div>
      </LeafLetMap>
    </div>
  );
};


const modalComponent = (props: {onDissmis:()=>void,orderId:string}) => (
  <IonContent>
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton onClick={() => props.onDissmis()}>cancel</IonButton>
      </IonButtons>
      <IonButtons slot="end">
        <IonButton onClick={() => props.onDissmis()}>Accept</IonButton>
      </IonButtons>
    </IonToolbar>
    {<OrderCardWithOrder id={props.orderId} />}
  </IonContent>
);