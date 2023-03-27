import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { getAuth } from 'firebase/auth';
import { Store } from 'pullstate';
import * as React from 'react';
import { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import geoFirestore from '../api/geofirestore';
import { MarkerProps } from 'react-leaflet';
import { orderMarker, orderProps } from '../types';
import { useIonViewDidEnter } from '@ionic/react';
import useMounted from './useMounted';

const boundStore = new Store({
    orders:[],
    loading:false,
    bounds:{}
})

const useBoundOrders = () => {
    const [orders, setOrders] = React.useState<orderProps[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [bounds, setBounds] = useState<LatLngBounds>()

    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
         update()
    }, [])
    const {mounted} = useMounted()
    
  
    const update =async () => {
        setLoading(true)
        if(!bounds){return}
        try {
            var list=await geoFirestore.getNearOrder(bounds.getCenter())
            
            if(mounted){setLoading(false);setOrders(list) }

        } catch (error) {
            if(mounted){setLoading(false) }
            console.log('error :>> ', error);

        }
        console.log('fetching finish')
        
    }
    React.useEffect(()=>{
        if(!bounds){return}
        update()
    },[bounds])

    return { orders, loading, update,setBounds };
}
export default useBoundOrders