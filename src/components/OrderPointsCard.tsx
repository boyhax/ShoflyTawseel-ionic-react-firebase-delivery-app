import { IonCard, IonItem, IonLabel, IonIcon } from "@ionic/react";
import { locationSharp, pinSharp } from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Config } from "../config";

interface Props {
  point1: any;
  point2: any;
}

export default function OrderPointsCard({point1,point2}: Props) {
  

  return (<IonCard
          className={
            "flex flex-col w-min-32  gap-2 divide-x-2  divide-red-300 justify-center"
          }
        >
          {/* pick up point */}
          <IonItem className={"flex justify-center"}>
            <IonLabel>{point1??''}</IonLabel>
            <IonIcon color={"primary"} icon={locationSharp} />
          </IonItem>
          {/* drop point */}

          <IonItem className={"flex justify-center"}>
            <IonLabel>{point2??''}</IonLabel>
            <IonIcon color={"danger"} icon={pinSharp} />
          </IonItem>
        </IonCard>
  );
}
