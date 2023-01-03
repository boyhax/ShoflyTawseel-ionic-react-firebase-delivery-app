import { getAuth } from 'firebase/auth';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import * as React from 'react';
import { useState } from 'react';
import { subscripeUserApplications, } from '../providers/firebaseMain';



const useUserApplications = () => {
    const [userApplications, setUserApplications] = React.useState<QuerySnapshot<DocumentData>>()
    const [loading, setLoading] = React.useState<boolean>(true)
    const [mounted, setMounted] = useState(true)
    const uid = getAuth().currentUser?.uid!

    React.useEffect(() => {
        uid && update()
        return () => setMounted(false)
    }, [])

  
    const update = () => {
        setLoading(true)
        subscripeUserApplications(uid,
            (v) =>{ 
                setUserApplications(v) ; 
            if(mounted){setLoading(false) }
        return mounted?false:true })
    }
    

    return { userApplications, loading, update };
}
export default useUserApplications