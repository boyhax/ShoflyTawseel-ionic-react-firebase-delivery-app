
const Config_test={ 
    apiKey : process.env.REACT_APP_apiKey_test,
    authDomain: process.env.REACT_APP_authDomain_test,
    databaseURL:process.env.REACT_APP_databaseURL_test,
    projectId: process.env.REACT_APP_projectId_test,
    storageBucket: process.env.REACT_APP_storageBucket_test,
    messagingSenderId: process.env.REACT_APP_messagingSenderId_test,
    appId: process.env.REACT_APP_appId_test,
    measurementId: process.env.REACT_APP_measurementId_test,
    mapApiKey:process.env.REACT_APP_map_api_key

};
const Config_release={ 
    apiKey : process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL:process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
    mapApiKey:process.env.REACT_APP_map_api_key
};
export let Config=()=>{
    return process.env.NODE_ENV==="production"?Config_release:Config_test
};