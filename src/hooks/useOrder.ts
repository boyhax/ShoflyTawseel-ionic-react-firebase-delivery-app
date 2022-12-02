import * as React from 'react';
import { getTripCard, makeOrderFromDoc, orderProps } from '../providers/firebaseMain';

const useOrder =  (orderID:string)=>{
    const [order,setOrder] = React.useState<orderProps>()
    const [loading,setLoading] = React.useState<boolean>(true)

    React.useEffect(()=>{
        update()
    },[])
    const update=()=>{
        setLoading(true)
        getTripCard(orderID).then((v)=>{setOrder(makeOrderFromDoc(v))}).finally(()=>setLoading(false))
    }
    return {order,loading,update}
}
export default useOrder