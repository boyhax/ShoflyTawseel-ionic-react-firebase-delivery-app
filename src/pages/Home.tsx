import React, {  } from 'react';
import 'leaflet/dist/leaflet.css';
import Page from '../components/Page';
import HomeDriver from './HomeDriver';
import HomeUser from './HomeUser';
import useDriverUserMode from '../hooks/useDriverUserMode';




const Home = () => {

  const {driverMode} = useDriverUserMode()
  

  return (
    <div >
           {driverMode?<HomeDriver />:<HomeUser />}   
    </div>
  );
};

export default Home;
