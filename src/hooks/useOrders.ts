import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { getOrders, } from '../providers/firebaseMain';
import { orderFilter } from '../types';

const initalFilter: orderFilter = {
    to: '',
    from: '',
    userID: '',
    urgent: false,
}

const useOrders = () => {
    const [orders, setOrders] = React.useState<DocumentSnapshot<DocumentData>[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [lastDoc, setLastDoc] = React.useState<DocumentSnapshot>()
    const [filter, ssetFilter] = React.useState<orderFilter>(initalFilter)
    const [mounted, setMounted] = useState(true)
    
    React.useEffect(() => {
        update(() => { })
        return () => setMounted(false)
    }, [])
    function setFilter(v:orderFilter){
        setOrders([]);
        setLastDoc(undefined)
        ssetFilter(v)
    }
    React.useEffect(() => {
        update(()=>{})
        console.log('filter :>> ', filter?filter:'');
    }, [filter]);

    const update = (onfinish: () => void) => {
        setLoading(true)
        getOrders(filter)
        .then((v) => { 
            if(!mounted){return}
            if(!v.empty){
                setOrders(v.docs);
                setLastDoc(v.docs[v.docs.length-1]);

            }else{
                setOrders([]);
                setLastDoc(undefined);
            }
         })
        .finally(() => { if(mounted){setLoading(false); onfinish()} })
    
    }
    const add = (num: number, onEnd: () => void) => {
        setLoading(true)
        if (!orders) { return }
        getOrders(filter, num, lastDoc)
        .then((v) => { if (mounted && !v.empty) { setOrders([...orders, ...v.docs]) } })
        .finally(() => {if(mounted){ setLoading(false); onEnd()} })

    }
    const reset = () => { setFilter(initalFilter) };

    return { orders, loading, update, add, setFilter, filter, reset };
}
export default useOrders