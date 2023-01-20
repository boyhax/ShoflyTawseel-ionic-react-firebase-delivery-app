import { Store } from "pullstate";
import * as React from "react";

import { createContext, useContext } from "react";
import { uploadNewOrder } from "../../providers/firebaseMain";
import { newOrderProps, orderProps } from "../../types";
import AddOrderPage from "./AddOrderPage";
interface Props {
  step: number;
  loading: boolean;
  order: newOrderProps | any;
  update: (d: any) => void;
}
const initialProps: Props = {
  step: 1,
  loading: false,
  order: { to: { key: "", value: "" }, from: { key: "", value: "" } },
  update: (d: any) => {},
};
const newOrderStore = new Store(initialProps);

export const useNewOrder = () => {
  const { order, loading, update, step } = newOrderStore.useState();

  const [submitted, setSubmitted] = React.useState(false);

  const { urgent, from, to, comment, geoLocation, type } = order;
  
  const setOrder = (v: Partial<newOrderProps>) => {
    newOrderStore.update((s) => (s.order = { ...s.order, ...v }));
  };
  function setUrgent(b: boolean) {
    newOrderStore.update((s) => (s.order.urgent = b));
  }

  const setLoading = (b: boolean) => {
    newOrderStore.update((s) => (s.loading = b));
  };

  const setStep = (b: number) => {
    newOrderStore.update((s) => (s.step = b));
  };
  const stepNext = () => {
    setStep(step + 1);
  };
  const stepBack = () => {
    setStep(step - 1);
  };
  const submitOrder = async () => {
    setLoading(true);

    try {
      if (from && to) {
        await uploadNewOrder({
          from: from,
          to: to,
          comment: order.comment,
          type: order.type,
          urgent: order.urgent,
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.log("error submitiing order :>> ", error);
    }
    setLoading(false);
  };
  const values = {
    order,
    urgent,
    loading,
    submitOrder,
    step,
    stepBack,
    stepNext,
    setUrgent,
    submitted,
  };

  return values;
};

export default AddOrderPage;
