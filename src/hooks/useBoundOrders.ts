import { getAuth } from 'firebase/auth';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { getBoundeOrders, subscripeUserApplications, } from '../providers/firebaseMain';
import { orderProps } from '../types';



const useBoundOrders = () => {
    const [orders, setOrders] = React.useState<any>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [mounted, setMounted] = useState(true)
    const [bounds, setBounds] = useState<any>()

    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
        uid && update()
        return () => setMounted(false)
    }, [])

  
    const update =async () => {
        setLoading(true)
        try {
            const snap =await getBoundeOrders({
                bounds:bounds
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