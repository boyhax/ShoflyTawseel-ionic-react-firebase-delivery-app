import * as React from 'react';
import { Redirect, useHistory } from 'react-router';
import { useGlobals } from '../providers/globalsProvider';

const AuthRoute:React.FC= (props)=>{
    const {user} = useGlobals()
    
    return<div>
    {user && props.children}
    {!user && <Redirect to={'/signin'}></Redirect>}
    </div>
}
export default AuthRoute