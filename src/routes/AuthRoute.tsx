import { IonRouterOutlet } from '@ionic/react';
import * as React from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import SignIn from '../pages/authPages';
import Profile from '../pages/Profile';
import { useGlobals } from '../providers/globalsProvider';
import { userStore } from '../Stores/userStore';

const AuthRoute:React.FC= (props)=>{
    const {user} = userStore.useState()
    
    return<div style={{background: 'red'}}>
        

    
    {user && props.children}
    {!user && <SignIn/>}
    
    </div>
}
export default AuthRoute