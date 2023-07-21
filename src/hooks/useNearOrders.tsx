import * as React from 'react';
import geoFirestore from '../api/geofirestore';
import { orderProps } from '../types';
import useMounted from './useMounted';
import { TT } from '../components/utlis/tt';
import { Store } from 'pullstate';


const NearOrders = new Store<{items:orderProps[]}>({
    items:[],
})
export default function useNearOrders()  {
    const items = NearOrders.useState(s=>s.items)

    const [loading, setLoading] = React.useState<boolean>(true)

    const {mounted} = useMounted()
    const [error, setError] = React.useState<string>()
    
    
    
    const searchNear=(point:any [], radius: number = 20,limit=5)=>{
        setError(undefined)
           try {
            // geoFirestore.getNearOrder(point,radius,limit ).then((d)=>{
            //     if(mounted){
            //         NearOrders.update(s=>{
            //             s.items = d
            //         })
            //         setLoading(false)
            //     }
            // }
            // )
           } catch (error) {
            mounted && setLoading(false)
            mounted && setError(TT('No Orders Found'))
           }
            

        
        console.log('update near orders :>> ');
    }


    
    

    return { items, loading,error,searchNear  };
}
