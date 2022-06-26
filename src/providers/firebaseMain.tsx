import React from "react";
import moduleName, { addDoc, arrayUnion, collection, deleteDoc, doc, FieldValue, Firestore, getDoc, getFirestore, increment, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { profile } from "console";
import { getAuth, updateProfile } from "firebase/auth";
import { auth } from "firebaseui";
import { useGlobals } from "./globalsProvider";
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
  export type orderProps={
    name:string,
    uid:string,
    from:string,
    to:string,
    time:any,
    flagged:boolean,
    number:string,
    comment:string|undefined|null,
    id?:string

  }
  
  export async function addNewTripCard(data:orderProps){
    var state:any=false
    try {
      const newOrderRef = doc(collection(getFirestore(), "orders"));
      await setDoc(newOrderRef, {id:newOrderRef.id,...data});
      state = true
    } catch (error) {
      console.log(error)
      state = false
    }
    return state
  }
export async function getProfile(uid:string) {
  return await getDoc(doc(getFirestore(),"users/"+uid))
  
}
export async function updateUserProfile(uid:any,data:any){
  
  if(! await profileExist(uid)){
   return createNewProfile(uid,data)
  }else{
    updateProfile(getAuth().currentUser!,{displayName:data.name!})
    return updateDoc(doc(getFirestore(),"users/"+uid),data)
  
  }
  
}
export async function profileExist(uid:string){
  return await (await getProfile(uid)).exists()
}
export function createNewProfile(uid:any,data:any){
    const col = doc(getFirestore(),"users/"+uid)
     const d = setDoc(col,data).then((d)=>{
console.log('new profile created :>> ', d);
  alert("تم تاكيد معلومات الحساب شكرا")
    },(err)=>{
      console.log('err :>> ', err);
    })
    return d
}
export const reportOrder=async(order:orderProps,onDeleted?:()=>void)=>{
  const ref = doc(getFirestore(),"orders/"+order.id)
  const data = await (await getDoc(ref)).data()
  console.log('order reported :>> ', order.id);
  console.log('order.reportsCounts :>> ', data!.reportsCounts!);
  const userRef = doc(getFirestore(),"users/"+order.uid) 
  const up = await updateDoc(ref,{reportsCounts:increment(1),reports:arrayUnion(order.id)})
    
  if(data!.reportsCounts!>=2){
    deleteOrder(order)
    if(onDeleted){
      onDeleted()
    }
    console.log('reported deleted doc :>> ',order.id!);
  }else{
    console.log("reported : ",order.id!)
    await updateDoc(ref,{reportsCounts:increment(1)})
  }
}
export async function deleteOrder(order:orderProps) {
  deleteDoc_("orders/"+order.id)

}
export async function deleteDoc_(path:string) {
  const res = await deleteDoc(doc(getFirestore(),path))
  console.log(' deleted doc path :>> ',path);

}