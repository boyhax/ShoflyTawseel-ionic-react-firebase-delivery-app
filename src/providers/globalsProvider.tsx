import React, { createContext, useContext, useState,SetStateAction, useEffect } from "react";  
import { getAuth, onAuthStateChanged, UserInfo } from "firebase/auth";
import { userInfo } from "os";

const globalsContext = createContext({user:false});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState(false)
    useEffect(()=>{
        onAuthStateChanged(getAuth(),(user)=>{
            console.log('user  :>> ', !!user );
            setUser(!!user)
          })
    },[])
    
    
    return<globalsContext.Provider value={{user}}>
        {props.children}
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider