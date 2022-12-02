import { DocumentData, DocumentSnapshot, QueryConstraint } from 'firebase/firestore';
import * as React from 'react';
import { getOrders, getTripCard, makeOrderFromDoc, orderFilter, orderProps } from '../providers/firebaseMain';

const useOrders = () => {
    const [orders, setOrders] = React.useState<DocumentSnapshot<DocumentData>[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [lastDoc, setLastDoc] = React.useState<DocumentSnapshot>()
    const [filter, setFilter] = React.useState<orderFilter>()


    React.useEffect(() => {
        update(()=>{})
    }, [])

    React.useEffect(() => {
        update(()=>{})
    }, [filter])

    React.useEffect(() => {
        orders && setLastDoc(orders[orders?.length - 1])
    }, [orders]);

    const update = (onfinish:()=>void) => {
        setLoading(true)
        getOrders(filter).then((v) => { setOrders(v.docs) }).finally(() => {setLoading(false);onfinish()})
    }
    const add = (num: number) => {
        setLoading(true)
        if (!orders) { return }
        getOrders(filter , num, lastDoc).then((v) => { setOrders([...orders, ...v.docs]) }).finally(() => setLoading(false))

    }
    const doFilter = (_filter: orderFilter) => 
    { setFilter(_filter) }
    return { orders, loading, update, add, doFilter }
}
export default useOrders