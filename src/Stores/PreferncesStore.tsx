import { Store } from 'pullstate';


const initialProps={
    user:null,
    profile:undefined,
    address:null,
    driver:null,
}

export const PreferencesStore = new Store(initialProps)



export function usePreferences(){
   
    return{}
}
