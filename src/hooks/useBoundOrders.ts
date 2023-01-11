import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { useState } from 'react';
import { getBoundeOrders, } from '../providers/firebaseMain';



const useBoundOrders = () => {
    const [orders, setOrders] = React.useState<any>()
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
                point:bounds,from:true,radius:50000
            })
            var list=[]
            snap.docs.forEach((doc)=>{
                list.push({id:doc.id,...doc.data()})
            })
            if(mounted){setLoading(false) }

        } catch (error) {
            if(mounted){setLoading(false) }
            console.log('error :>> ', error);

        }
        console.log('fetching finish')
        
    }
    

    return { orders, loading, update,setBounds };
}
export default useBoundOrders