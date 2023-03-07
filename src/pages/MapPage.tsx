import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { cube } from "ionicons/icons";
import useBoundOrders from "../hooks/useBoundOrders";
import {  LeafLetMap } from "../components/LeafLetMap";
import { LeafletMouseEvent, marker } from "leaflet";
import { Store } from "pullstate";
import { useHistory } from "react-router";
import { OrderIcon } from "../components/utlis/leafletMapIcons";
import { geoToLatlng } from "../providers/firebaseMain";
import { orderMarker, orderProps } from "../types";
import OrderCardWithOrder from "../components/OrderCard/withOrder";
import { GeoPoint } from "firebase/firestore";

interface _state {
  value: any;
  centerMarker: boolean;
  marker: any;
  oldMarkers: any[];
  orderId:string;
  map:L.Map|null
}
const useBoundOrdersStore = new Store({
  orders: [],
  loading: true,
  setBounds: (b: any) => {},
  update: () => {},
});
const MapPage: React.FC = () => {
  const [_state, _setState] = useState<_state>({
    value: 1,
    centerMarker: false,
    marker: "",
    oldMarkers: [],
    orderId:'',
    map:null
  });
  const history = useHistory()
  const state = useRef(_state);
  const modalComponent = (props:any)=><IonContent>
  <IonToolbar>
    <IonButtons slot="start">
      <IonButton onClick={()=>dissmis()}>close</IonButton>
    </IonButtons>
  </IonToolbar>
  {<OrderCardWithOrder id={props.orderId}/> }
</IonContent>
  const [present,dissmis] = useIonModal(modalComponent,{orderId:state.current.orderId})
  useEffect(() => {
    return () => unSetup();
  }, []);
 
  const { orders, loading, setBounds, update } = useBoundOrders();

  useEffect(() => {
    if (state.current.map) {
      if (!orders) {
        return;
      }
      refreshMarkers(orders);
    }
  }, [orders]);

  function onOrderMarkerClick(event:LeafletMouseEvent,marker:L.Marker<any>,order:orderProps){
    state.current.orderId = order.id;
    present();
  }
  function refreshMarkers(markers: orderProps[]) {
    clearMarkers();
    state.current.oldMarkers =  addMarkers(markers)! ;
  }

  function addMarkers(markers: orderProps[]) {
    var list: any[] = [];
    if (!state.current.map) {
      return;
    }else{
      markers.forEach((v) => {
        const m = marker(
          geoToLatlng(v.geo.from),
          { icon: OrderIcon, title: (" click to pick order") },
          
        ).addTo(state.current.map!)
          .addEventListener("click", (e) => {
            onOrderMarkerClick(e,m,v);
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
  function setup(map:L.Map) {
    state.current.map = map;
    setTimeout(() => {
      updateBounds(map);

    }, 100);
    
    map.addEventListener(
      "dragend",
      (data) => {
        console.log('dragend :>> ', data);
        updateBounds(map);
      },
      {}
    );

    // map.addEventListener(
    //   "click",
    //   (d) => {
    //     console.log("map click ", d.latlng);
    //     // geoFirestore.addGeo("asdsdssd", d.latlng, true).then((d) => {
    //     //   console.log("geo point added  :>> ", d);
    //     // });
    //   },
    //   {}
    // );
  }
  function updateBounds(map:L.Map) {
    
    var b = map.getBounds();
    setBounds(b);
    console.log("bounds updated :>> ");
  }

  function unSetup() {
    state.current.map! && state.current.map!.remove();
  }
  
  
  return (
    <div className={"w-full flex-col h-full"}>
      <LeafLetMap id={'mainMap'} onMap={setup} layerButton  locateButton>
        <div className={"flex  w-full h-full  "}>
          
          <div className={'flex w-full justify-center self-end bg-gradient-to-t from-white via-white to-transparent'}>
            {/* <IonButton
            color={'primary'}
              className={"pointer-events-auto  w-10/12 "}
              onClick={()=>history.push('addorder')}
            >
              <IonIcon color={'light'} slot={'icon-only'} icon={cube} />
              Make order
            </IonButton> */}
          </div>
        </div>
      </LeafLetMap>

    </div>
  );
};

export default MapPage;
