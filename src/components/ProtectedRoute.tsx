import React from 'react';
import SignIn from '../pages/authPages/SignIn';
import { useGlobals } from '../providers/globalsProvider';



const ProtectedRoute: React.FC<any> = (props) => {
  const {user} = useGlobals()
  if(user){
    return props.children
    
  }else{
    return <SignIn></SignIn>
  }
  
};

export default ProtectedRoute;
