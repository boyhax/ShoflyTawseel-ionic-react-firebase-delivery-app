import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { getOrders, } from '../providers/firebaseMain';
import { orderFilter } from '../types';

const initalFilter: orderFilter = {
    to: '',
    from: '',
    userID: '',
    urgent: undefined,
}

const useOrders = () => {
    const [orders, setOrders] = React.useState<DocumentSnapshot<DocumentData>[]>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [lastDoc, setLastDoc] = React.useState<DocumentSnapshot>()
    const [filter, setFilter] = React.useState<orderFilter>(initalFilter)
    const [mounted, setMounted] = useState(true)

    React.useEffect(() => {
        update(() => { })
        return () => setMounted(false)
    }, [])

    React.useEffect(() => {
        update(() => { console.log('on update filter') })
    }, [filter])

    React.useEffect(() => {
        orders && setLastDoc(orders[orders?.length - 1])
    }, [orders]);

    const update = (onfinish: () => void) => {
        setLoading(true)
        getOrders(filter).then((v) => { setOrders(v.docs) }).finally(() => { if(mounted){setLoading(false); onfinish()} })
    }
    const add = (num: number, onEnd: () => void) => {
        setLoading(true)
        if (!orders) { return }
        getOrders(filter, num, lastDoc).then((v) => { if (mounted) { setOrders([...orders, ...v.docs]) } }).finally(() => {if(mounted){ setLoading(false); onEnd()} })

    }
    const reset = () => { setFilter(initalFilter) };

    return { orders, loading, update, add, setFilter, filter, reset };
}
export default useOrders