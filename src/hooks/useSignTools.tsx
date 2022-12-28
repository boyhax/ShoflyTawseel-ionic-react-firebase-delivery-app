import { useEffect, useState } from "react";

const useSignTools=()=>{
    const [signedIn,setSignedIn] = useState<boolean>(false)

    useEffect(() => {
        return unsub
    }, []);
    function unsub(){
    }
    async function getPhone():Promise<string>{

        return new Promise((resolve, reject)=>{
            console.log('tring to get phone')
            setTimeout(() => {
                resolve("96895373990")

            }, 1000);
            // if(true){
            //     resolve("96895373990")
            // }else{
            //     reject("nooo")
            // }

        })
    }
    async function getEmail():Promise<string>{
        return new Promise((resolve, reject)=>{
            console.log('tring to get email')
            if(true){
                resolve("ddd")
            }else{
            }

        })
    }
    return {signedIn,getEmail,getPhone}
  }
  export default useSignTools