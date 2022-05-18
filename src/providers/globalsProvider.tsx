import React, { createContext, useContext, useState,SetStateAction } from "react";  
import { getAuth } from "firebase/auth";

const globalsContext = createContext({uid:"",setUid:(uid:string)=>{}});

const GlobalProvider:React.FC =(props)=>{
    const [uid,setUid] = useState("")
    
    return<globalsContext.Provider value={{uid,setUid}}>
        {props.children}
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider