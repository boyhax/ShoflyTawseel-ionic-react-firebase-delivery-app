import React, { ReactChild } from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import './map.css'
import { IonIcon } from '@ionic/react';
import { location } from 'ionicons/icons';

interface MyMapProps {
  onMap: (map: GoogleMap) => void,
  controls?: ReactChild,
  header?: ReactChild,
  footer?: ReactChild,

}

interface MyMapState {
  mapElement: any,
  centerMarker: any,
  centerlocation: any,
  map: GoogleMap | undefined,
  props: MyMapProps
}

class GMap extends React.Component<MyMapProps, MyMapState> {
  myRef: any

  constructor(props: MyMapProps) {
    super(props);
    this.state = {
      mapElement: this.myRef,
      centerMarker: null,
      centerlocation: null,
      map: undefined,
      props: props
    };
    this.myRef = React.createRef();

  };
  componentDidMount() {
    this.createMap()
  }
  componentWillUnmount(): void {
    this.state.map?.destroy()
  }

  async createMap() {

    const map = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.myRef.current,
      apiKey: process.env.REACT_APP_map_api_key!,
      config: {

        androidLiteMode: true,
        disableDefaultUI: true,
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8,
      },

    })
    this.setState({ map: map })
    this.props.onMap(map)


  }
  async markMyLocation() {
    const pos = await Geolocation.getCurrentPosition()
    var map = this.state.map

    if (map) {
      map.setCamera({
        coordinate: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        zoom: 10,
        animate: true,

      })

    }
  }

  render() {
    return (<div className={'mapMainContainer '}>
      <div>
        {this.props.header && this.props.header}
      </div>

      <div className={`map-control 
      pointer-events-none w-full h-full
       `}>
        {this.props.controls && this.props.controls}
      </div>
      {/* <div className={`map-control left-[50%] top-[50%] m-auto `}>
        {true &&  <div  className={'text-5xl'} >
          <IonIcon color={'primary'}   icon={location}/>
        </div>}
      </div> */}

      <div className={'mapContainer'}>
      
        <capacitor-google-map options={{ streetViewControl: false }}
          ref={this.myRef}
          id={'my-cool-map'}
          className={'map'}
        >

        </capacitor-google-map>
      </div>

      <div>
        {this.props.footer && this.props.footer}
      </div>

    </div>);
  }
}

export default GMap;