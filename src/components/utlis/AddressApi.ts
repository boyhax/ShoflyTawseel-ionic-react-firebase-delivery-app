import { OpenStreetMapProvider } from 'leaflet-geosearch';

export type Address={
    address: string,
    id:string,
    location: {lat: string, lng: string},
    name: string,
    types: string[]
    }
    export async function getAddressOptions(text:string,call:(t:Address[])=>void){
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '5db7bea325msh20d1ea444db0b53p123e53jsn3b35fd61bc13',
          'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
        }
      };
      let r:any[] = []
      let url = 'https://trueway-places.p.rapidapi.com/FindPlaceByText?text={} oman&language=ar'
      .replace('{}',text);
      let t = await (await fetch(url, options)).json();
      console.log('t :>> ', t);
      r=t
      call(t.results)
      return t.results
    }
    // import

// setup
const provider = new OpenStreetMapProvider({
    params: {
      'accept-language': 'ar', // render results in Dutch
      countrycodes: 'om', // limit search results to the Netherlands
      addressdetails: 1, // include additional address detail parts
    },
  });

// search
export async function leafletSearch(text:string,onRes?:(d:any)=>void){
    const results = await provider.search({ query: text, });
    
    onRes && onRes(results)
    return results
}
leafletSearch("صور",(d)=>{console.log('leaflet search result :>> ', d);})
// bounds
// : 
// (2) [Array(2), Array(2)]
// label
// : 
// "صور, قضاء صور, محافظة الجنوب, 1601, لبنان"
// raw
// : 
// {place_id: 299017141, licence: 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', osm_type: 'relation', osm_id: 12196423, boundingbox: Array(4), …}
// x
// : 
// 35.1964023
// y
// : 
// 33.2721211