import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Store } from 'pullstate';
import * as React from 'react';
import { db } from '../App';
import { UserProfileFromDoc } from '../providers/firebaseMain';
import { UserProfile } from '../types';

interface Props{
    user:'loading'|boolean,
    profile:'loading'|UserProfile|undefined,
    online:'loading'|boolean,
}
const initialProps:Props={
    user:'loading',
    profile:'loading',
    online:'loading',

}

export const userStore = new Store(initialProps)