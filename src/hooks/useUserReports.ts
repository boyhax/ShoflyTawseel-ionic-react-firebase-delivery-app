import { getAuth } from 'firebase/auth';
import { DocumentData, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { getUserReports, subscripeUserReports, } from '../providers/firebaseMain';



const useUserReports = () => {
    const [reports, setReports] = React.useState<QuerySnapshot<DocumentData>>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [mounted, setMounted] = useState(true)
    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
        uid && update()
        return () => setMounted(false)
    }, [])

   
  
    const update = () => {
        setLoading(true)
        subscripeUserReports(uid,
            (v) =>{ 
                setReports(v) ; 
            if(mounted){setLoading(false) }
        return mounted?false:true })
    }
    

    return { reports, loading, update };
}
export default useUserReports