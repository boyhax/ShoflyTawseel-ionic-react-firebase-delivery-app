import { IonLoading } from '@ionic/react';
import * as React from 'react';
import { Redirect } from 'react-router';
import { useGlobals } from '../providers/globalsProvider';

const DevloperRoute:React.FC=(props)=>{
    const {user,profile} = useGlobals()

    return<>
    <IonLoading isOpen={user===undefined}></IonLoading> 
    {profile?profile.devloper ?props.children
    :<h2>not dev</h2>
    :<></>}
    </>
}
export default  DevloperRoute