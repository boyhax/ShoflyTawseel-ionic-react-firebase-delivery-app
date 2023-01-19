import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { getAuth } from 'firebase/auth';
import { Store } from 'pullstate';
import * as React from 'react';
import { useState } from 'react';
import { LatLngBounds } from 'leaflet';
import geoFirestore from '../providers/geofirestore';

const boundStore = new Store({
    orders:[],
    loading:false,
    bounds:{}
})

const useBoundOrders = () => {
    const [orders, setOrders] = React.useState<any[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [mounted, setMounted] = useState(true)
    const [bounds, setBounds] = useState<LatLngBounds>()

    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
        uid && update()
        return () => setMounted(false)
    }, [])

  
    const update =async () => {
        setLoading(true)
        if(!bounds){return}
        try {
            const snap =await geoFirestore.getGeoQuery(
                bounds.getCenter(),
                (bounds.getNorthEast().distanceTo(bounds.getCenter())/1000),
                true,
            )
            var list:any[]=[]
            snap.forEach((doc)=>{
                list.push({id:doc.id,...doc.data()})
            })

            if(mounted){setLoading(false);setOrders(list) }
            console.log('list :>> ', list);

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