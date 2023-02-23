import { Geolocation } from "@capacitor/geolocation";
import { IonButton, IonIcon, IonItem } from "@ionic/react";
import { cube, location as locationIcon } from "ionicons/icons";
import { LatLng, Map, marker } from "leaflet";
import React, { useEffect, useState } from "react";
import GoogleSearchAutoComplete from "./GoogleSearchAutoComplete";
import { LeafLetMap } from "./LeafLetMap";
import { PenIcon } from "./utlis/leafletMapIcons";

interface Props extends React.ThHTMLAttributes<Element> {
  placeHolder: string;
  onValueSet: (value: LatLng) => void;
}

const GeoPointPicker = ({ placeHolder, onValueSet }: Props) => {
  const [value, setValue] = useState<LatLng>();

  const [map, setMap] = useState<Map>();
  useEffect(() => {
    if (map) {
      const m: any = marker(map.getCenter(), {
        icon: PenIcon,
      }).addTo(map);

      let flytoPoint = (point: { lat: number; lng: number }) => {
        map.flyTo(point, 10);
      };

      map.on("move", function (e) {
        m.setLatLng(map.getCenter());
      });
    }
  }, [map]);

  function submit() {
    map && onValueSet(map.getCenter());
    map && setValue(map.getCenter());
  }

  return (
    <div className={"w-full h-full "}>
      <LeafLetMap onMap={setMap} locateButton centerPin>
        <div className={"pointer-events-none flex  flex-col w-full h-full"}>
          <div className={"flex  w-full h-full  "}>
            <div
              className={
                "flex w-full justify-center self-end bg-gradient-to-t from-white via-white to-transparent"
              }
            >
              <IonButton
                color={"primary"}
                className={"pointer-events-auto  w-10/12 "}
                onClick={submit}
              >
                {placeHolder}
              </IonButton>
            </div>
          </div>
        </div>
      </LeafLetMap>
    </div>
  );
};
export default GeoPointPicker;
