import * as React from 'react';
import { Redirect } from 'react-router';
import { useGlobals } from '../providers/globalsProvider';

const DevloperRoute:React.FC=(props)=>{
    const {profile} = useGlobals()

    return<>
    {profile?profile.devloper ?props.children
    :<h2>not dev</h2>
    :<Redirect to={'../signin'}></Redirect>}
    </>
}
export default  DevloperRoute