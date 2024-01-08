import { DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import useMounted from "./useMounted"

export default function useGetDoc(ref:DocumentReference){
    const[data,setData] = useState<DocumentSnapshot>()
    const[loading,setLoading] = useState(true)
    const[error,setError] = useState()
    const {mounted} = useMounted()
    useEffect(()=>{
      getData()
    },[])
    async function getData(){
      mounted && setLoading(true)
      mounted && setError(undefined)
      await getDoc(ref).then((doc)=>{mounted && doc.exists() && setData(doc)}).catch((err)=>{mounted && setError(err)})
      mounted && setLoading(false)
    }
  
    return{data,loading,error,getData}
  }