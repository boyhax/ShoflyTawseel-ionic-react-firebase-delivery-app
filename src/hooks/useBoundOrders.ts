import * as React from "react";
import { useState } from "react";
import { LatLng, LatLngBounds } from "leaflet";
import geoFirestore from "../api/geofirestore";
import { orderProps } from "../types";
import useMounted from "./useMounted";

const useBoundOrders = () => {
  const [orders, setOrders] = React.useState<orderProps[]>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [bounds, setBounds] = useState<LatLngBounds>();

  React.useEffect(() => {
    update();
  }, []);
  const { mounted } = useMounted();

  const update = async () => {
    setLoading(true);
    if (!bounds) {
      return;
    }
    try {
      var list = await geoFirestore.getNearOrder(
        new LatLng(bounds.getCenter().lat, bounds.getCenter().lng),
        bounds.getNorthEast().lat - bounds.getSouthWest().lat
      );
      console.debug("point and range :>> ", new LatLng(bounds.getCenter().lat, bounds.getCenter().lng),
      bounds.getNorthEast().lat - bounds.getSouthWest().lat);

      console.debug("list near orders :>> ", list);
      if (mounted) {
        setLoading(false);
        setOrders(list);
      }
    } catch (error) {
      if (mounted) {
        setLoading(false);
      }
      console.log("error :>> ", error);
    }
    console.log("fetching finish");
  };
  React.useEffect(() => {
    if (!bounds) {
      return;
    }
    update();
  }, [bounds]);

  return { orders, loading, update, setBounds };
};
export default useBoundOrders;
