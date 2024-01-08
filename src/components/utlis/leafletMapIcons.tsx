import L from "leaflet";

export const greenIcon = L.icon({
    iconUrl: require("../../assets/icons8-user-location-100.png"),
    // shadowUrl: 'leaf-shadow.png',
  
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
  });
  export const PenIcon = L.icon({
    iconUrl: require("../../assets/pin.png"),
    // shadowUrl: 'leaf-shadow.png',
  
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
  });
  export const OrderIcon = L.icon({
    iconUrl: require("../../assets/OrderlocationIcon.png"),
    // shadowUrl: 'leaf-shadow.png',
  
    iconSize: [50, 50], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
  });
  export const markerAIcon = L.icon({
    iconUrl: require("../../assets/icons8-marker-a-50.png"),
    // shadowUrl: 'leaf-shadow.png',
  
    iconSize: [40, 40], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
  });
  export const markerBIcon = L.icon({
    iconUrl: require("../../assets/icons8-marker-b-50.png"),
//     html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/> </svg>
// `,
    // shadowUrl: 'leaf-shadow.png',
  
    iconSize: [40, 40], // size of the icon
    // shadowSize: [50, 64], // size of the shadow
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
  });