import React from "react";
import moduleName, { addDoc, collection, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
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
  export async function addNewTripCard(data:{}){
    var _data:any=false
    
    try {
      var fsRef = await addDoc(collection(getFirestore(),"orders"),data)
      _data = fsRef.id?true:false
  
    } catch (error) {
      console.log(error)
    }
    // var fsRef = await addDoc(collection(getFirestore(),"orders"),data)
    return _data
  }


