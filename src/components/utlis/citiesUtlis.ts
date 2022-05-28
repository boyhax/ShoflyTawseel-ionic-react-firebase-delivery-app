import React from "react";
type dataProps={
    value:string,
    key:string
}
export const citiesList = require("../../assets/cities.json")[0]["oman"]["ar"]

export var Cities :dataProps[]=[]

    citiesList.map((value:string) => {
        Cities.push({value:value,key:value})
    })