import  { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, 
  getDoc, getFirestore, setDoc, 
   updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { setupIonicReact } from '@ionic/react';
import { Config } from '../config';
import { userProfile } from './globalsProvider';

const firebaseConfig=Config
initializeApp(firebaseConfig)
setupIonicReact({
  mode: 'md'
});
const db = getFirestore()


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
    reportsGot?:Array<string>,
    appliedUsers?:String[]

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
  const uid = getAuth().currentUser?.uid
  var reportedByUser =false
  const profile = userProfile
  if(order && order.reportsGot! && profile && profile.reportsDone!){
      const filteredArray = intersection(profile.reportsDone,order.reportsGot)
      console.log('filteredArray :>> ', filteredArray);
        reportedByUser = filteredArray.length >0
      }
  if(reportedByUser){
    console.log("already reported by")
    return
  }
  
  const report={
    orderId:order.id,
    orderOwner:order.uid,
    from:uid,
    why:why?why:null
  } 
   
  
   return await addDoc(collection(db,"ordersReports"),report)
    
  
}
export async function deleteOrder(order:orderProps) {
  deleteDoc_("orders/"+order.id)

}
export async function deleteDoc_(path:string) {
   await deleteDoc(doc(getFirestore(),path))
  console.log(' deleted doc path :>> ',path);

}
export async function isReportedBy(userUID:string,docUID:string) {
  const reports = await getOrderReports(docUID)
  if(!reports ===undefined){
    console.log('reports :>> ', reports);
    reports.forEach((value:any) => {
      if(value.by === userUID){
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
export async function applyForCard(UserUID:string,cardUID:string) {
  const res = await updateDoc(doc(getFirestore(),"orders/"+cardUID),
  {"appliedUsers":arrayUnion(UserUID)})
  return res
}
export async function removeApplicationToOrder(UserUID:string,cardUID:string) {
  const res = await updateDoc(doc(getFirestore(),"orders/"+cardUID),
  {"appliedUsers":arrayRemove(UserUID)})
  return res
}
export function is_user_applied_to_card(UserUID:string,order:orderProps){
  return order.appliedUsers?.includes(UserUID)
}

export function intersection(a:Array<any>,b:Array<any>){
  var filteredArray = a.filter(function(n) {
    return b.indexOf(n) !== -1;
});
return filteredArray
}