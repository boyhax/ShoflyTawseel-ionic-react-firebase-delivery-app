import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { getAuth } from 'firebase/auth';
import { Store } from 'pullstate';
import * as React from 'react';
import { useState } from 'react';
import { getBoundeOrders, } from '../providers/firebaseMain';

const boundStore = new Store({
    orders:[],
    loading:false,
    bounds:{}
})

const useBoundOrders = () => {
    const [orders, setOrders] = React.useState<any[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [mounted, setMounted] = useState(true)
    const [bounds, setBounds] = useState<LatLng>()

    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
        uid && update()
        return () => setMounted(false)
    }, [])

  
    const update =async () => {
        setLoading(true)
        if(!bounds){return}
        try {
            const snap =await getBoundeOrders({
                point:bounds,from:true,radius:500000
            })
            var list:any[]=[]
            snap.docs.forEach((doc)=>{
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