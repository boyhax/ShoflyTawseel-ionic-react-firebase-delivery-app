import { IonLoading } from '@ionic/react';
import * as React from 'react';
import { Redirect } from 'react-router';
import { useGlobals } from '../providers/globalsProvider';
import { userStore } from '../Stores/userStore';

const DevloperRoute:React.FC=(props)=>{
    const {user,profile} = userStore.useState()

    return<>
    <IonLoading isOpen={user===undefined}></IonLoading> 
    {profile?profile.role==='admin' ?props.children
    :<h2>not dev</h2>
    :<></>}
    </>
}
export default  DevloperRoute