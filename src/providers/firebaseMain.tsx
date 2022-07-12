import React from "react";
import  { addDoc, arrayUnion, collection, deleteDoc, doc, 
  FieldValue, Firestore, getDoc, getFirestore, increment, setDoc, 
   updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from "firebase/auth";

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
    id?:string,
    reported?:number,
    reports?:Array<{by:string,why:String}>

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
export const reportOrder=async(order:orderProps,why?:string,onDeleted?:()=>void)=>{
  const useruid = getAuth().currentUser?.uid!
  const ref = doc(getFirestore(),"orders/"+order.id)
  const data = await (await getDoc(ref)).data()
  console.log('order reports :>> ', data!.reports!);
  console.log('order.reportsCounts :>> ', data!.reported!);
  var reportedByUser =false
  if(data && data.reported){
    data.reports!.forEach((value:any) => {
      if(value.by === useruid){
        console.log("already reported by")
        reportedByUser = true
      }
    })
  }
 if(reportedByUser){
  return
 }
  const userRef = doc(getFirestore(),"users/"+order.uid)
  const selfRef = doc(getFirestore(),"users/"+getAuth().currentUser?.uid)

  const report={
    id:order.id,
    why:why?why:"no why"
  } 
   updateDoc(userRef,{reported:arrayUnion(report)})
   updateDoc(selfRef,{didReport:arrayUnion(report)})

  const newReport = {
    by:useruid,
    why:why?why:"no why"
  }
  const up = await updateDoc(ref,{reported:increment(1),reports:arrayUnion(newReport)})
    
  
}
export async function deleteOrder(order:orderProps) {
  deleteDoc_("orders/"+order.id)

}
export async function deleteDoc_(path:string) {
  const res = await deleteDoc(doc(getFirestore(),path))
  console.log(' deleted doc path :>> ',path);

}
export async function isReportedBy(userUID:string,docUID:string) {
  const reports = await getOrderReports(docUID)
  if(!reports ==undefined){
    console.log('reports :>> ', reports);
    reports.forEach((value:any) => {
      if(value.by == userUID){
        return true
      }
    })
    return false
  }
  return true
}
async function getOrderReports(id:string){
  const data = await getDoc(doc(getFirestore(),"orders/"+id))
  
  return data.exists()?data.data().reports!?data.data().reports:[]:undefined
}