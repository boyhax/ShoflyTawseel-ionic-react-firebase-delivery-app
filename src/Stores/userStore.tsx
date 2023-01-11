import { Store } from 'pullstate';
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