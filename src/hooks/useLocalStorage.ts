import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key:string,def:T) {
  const [value, setValue] = useState<T>(def);

  useEffect(() => {
    var v :any= localStorage.getItem(key);
    if(v){
      if(typeof def === "object"){
        v = JSON.parse(v)
      }
      setValue(v)
    }else{
      if(typeof def === "object"){
        v = JSON.stringify(def);
      }
      setValue(v)
      localStorage.setItem(key,v)
    }

  }, [key]);
  

  return [value,setValue];
}
