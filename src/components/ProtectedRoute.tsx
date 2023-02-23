import React from 'react';
import SignIn from '../pages/authPages';
import { useGlobals } from '../providers/globalsProvider';
import { userStore } from '../Stores/userStore';



const ProtectedRoute: React.FC<any> = (props) => {
  const {user} = userStore.useState(s=>s)
  if(user){
    return props.children
    
  }else{
    return <SignIn></SignIn>
  }
  
};

export default ProtectedRoute;
