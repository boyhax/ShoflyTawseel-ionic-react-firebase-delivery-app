import React from "react";
import moduleName, { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
export async function getTripCard(id:String){
    var _data:any
    await getDoc(doc(getFirestore(),"orders/"+id)).then((data)=>{
      _data =data
    },(err:object)=>{
      console.log(err)
      _data = null
    })
    return _data
  }
  export async function updateTripCard(id:String,data:{}){
    updateDoc(doc(getFirestore(),"orders/"+id),data)
  }
  type tripCardProps={
    name:string,
    uid:string,
    from:string,
    to:string,
    time:Date,
    flagged:boolean,
    number:string
  }
  export async function addNewTripCard(data:tripCardProps){
    var _data:any=false
    
    try {
      var fsRef = await addDoc(collection(getFirestore(),"orders"),data)
      _data = fsRef.id
  
    } catch (error) {
      console.log(error)
    }
    return _data
  }
export async function getProfile(uid:string) {
  return await getDoc(doc(getFirestore(),"users/"+uid))
  
}
export function createNewProfile(uid:any,data:any){
    const col = doc(getFirestore(),"users/"+uid)
    setDoc(col,data).then((d)=>{
console.log('new profile created :>> ', d);
  alert("تم تاكيد معلومات الحساب شكرا")
    },(err)=>{
      console.log('err :>> ', err);
    })
}
