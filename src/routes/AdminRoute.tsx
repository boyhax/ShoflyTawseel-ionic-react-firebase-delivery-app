import { IonPage, IonRouterOutlet, IonTitle } from '@ionic/react';
import * as React from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import SignIn from '../pages/authPages';
import Profile from '../pages/Profile';
import { useGlobals } from '../providers/globalsProvider';

const AdminRoute:React.FC= (props)=>{
    const {user,profile} = useGlobals()
    
    return<div style={{background: 'red'}}>
        

    
    {user && profile?.role==='admin' && props.children}
    {!user && <SignIn/>}
    {user&& profile?.role!=='admin' && <IonPage>
        <IonTitle>
        Admin Only Page</IonTitle></IonPage>}
    
    </div>
}
export default AdminRoute