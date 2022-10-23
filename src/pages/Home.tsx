import React, { useEffect, useRef, useState } from 'react';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonFab, IonFabButton,
   IonGrid,
   IonHeader, IonIcon, IonPage,
     IonRow,
     IonTitle,
     IonToolbar } from '@ionic/react';
import './Home.css';
import { add, chatbox, menuOutline, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import AddOrder from '../components/AddOrder';
import MainMenu from '../components/MainMenu';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const Tab1= () => {
  
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const [fcmToken,setFcmToken] = useState<any>(null)

  const menuRef = useRef<any>()
  function onAddOrder(){
    setAddOrder(!addOrder)
  }
  function toggleMenu(){
    menuRef.current?.toggle()
  }
 
    return (
    <IonPage>
      <MainMenu menuRef={menuRef}></MainMenu>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle slot='primary' onClick={()=>history.push("/home")}>ShoflyTawseel</IonTitle>
          <IonButtons slot="start">            
            <IonButton onClick={()=>toggleMenu()}>
                <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
            <IonButton onClick={()=>history.push("/Profile")}>
              {user && profile ?profile.photoURL!==null?
              <IonAvatar>
                <img alt='user profile' src={profile.photoURL}></img>
              </IonAvatar>:
              <IonIcon slot="icon-only" icon={personCircle} />
              :<IonIcon slot="icon-only" icon={personCircle} />}
    
              </IonButton>

            
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{width:"100%",bottom: 0}}>
        {/* <OrderList></OrderList> */}
        <AddOrder isOpen={addOrder} setOpen={(v)=>setAddOrder(v)}/>
        <IonGrid style={{width:"100%",bottom: 0}}>
        <IonRow >
          <IonCard style={{maxWidth: "50%"}}>
            <IonCardHeader>
              profile
            </IonCardHeader>
            <IonCardContent>
              sdfffffffffff
              fffffsddfsdfdszhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhxczxcxzcxzcxzcxzcxzcxzcxzcxzczxcxzcxzcf
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardHeader>
              my Orders
            </IonCardHeader>
          </IonCard>
        </IonRow>
        <IonRow>
          
        </IonRow>
        <IonCard style={{height: '30%'}}>
        <IonCardHeader>Map</IonCardHeader>

      </IonCard>
        </IonGrid>
      </IonContent>
      <LeafLetMap></LeafLetMap>

      

      <IonFab vertical="bottom" horizontal="start" slot="float">
      <IonFabButton onClick={()=>{onAddOrder()}}>
        <IonIcon icon={add} />
      </IonFabButton>
      <IonFabButton onClick={()=>{history.push("chats/")}}>
        <IonIcon icon={chatbox} />
      </IonFabButton>
    </IonFab>
    </IonPage>
  );
};

export default Tab1;


export const LeafLetMap:React.FC=(props)=>{
          const [map,setMap]= useState({})
          // Similar to componentDidMount and componentDidUpdate:
          useEffect(() => {
            let current_lat = 28.625789;
            let current_long = 77.0547899;
            let current_zoom = 16;
            let center_lat = current_lat;
            let center_long = current_long;
            let center_zoom = current_zoom;
            
            let map = L.map('map', {
                center: [center_lat, center_long],
                zoom: center_zoom
              });
              setMap(map)

              L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);      
            },[]);

        return (

                <div id="map" 
                style={{display: 'flex',
                justifyContent:'center',
                 width:'100vw',height:'50vh'}}>
                </div>

);
}

