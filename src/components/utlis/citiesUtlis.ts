import React from "react";
import { getLang } from "../../App";
type dataProps={
    value:string,
    key:string
}
export const citiesList:string[] = require("../../assets/cities.json")[0]["oman"]['en']

export function Cities(lang?:string) :dataProps[]{
    return require("../../assets/cities.json")[0]["oman"][lang ||getLang()]
}

// console.log(JSON.stringify(Cities))