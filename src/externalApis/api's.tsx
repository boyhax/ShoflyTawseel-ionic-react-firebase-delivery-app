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
      let url = 'https://trueway-places.p.rapidapi.com/FindPlaceByText?text=sur oman&language=ar';
      url.replace('text',text)
      let t = await (await fetch(url, options)).json();
      console.log('t :>> ', t);
      r=t
      call(r)
      return r
    }