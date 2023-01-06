import React from "react";
import { getLang } from "../../App";
import { keyValue } from "../../types";

const sortFunction = (a: string, b: string, value: string) => {
    const A: string = a.toLowerCase();
    const B: string = b.toLowerCase();
    return B.indexOf(value || "")! - A.indexOf(value || "")!
  }

export const citiesList: string[] = require("../../assets/cities.json")[0]["oman"]['en']

export function Cities(lang?: string): keyValue[] {
    return require("../../assets/cities.json")[0]["oman"][lang || getLang()]
}
export const citienames = Cities('en').map((v)=>{return v.value})

export function getLocationSuggetions(searchText: string,quantity:number,filter?:(a:any)=>boolean) {
    var list: any[] = []
    list =[...Cities('ar'),...Cities('en')]
    list.sort((a,b)=>{return sortFunction(a.value,b.value,searchText)})
    quantity>=0?list = list.slice(0,quantity):list = list
    return list
}
// console.log('getLocationSuggetions :>> ', getLocationSuggetions('بد',10,{}));

// console.log(JSON.stringify(Cities))

// Muscat
// Sohar
// Salalah
// Nizwa
// Sur
// Ibri
// Khasab
// Ibra
// Saham
// Barka
// Rustaq
// Bidbid
// Al-Kamil wal Wafi
// Al-Mudhaibi
// Al-Seeb
// Al-Suwaiq
// Bawshar
// Duqm
// Izz
// Jalan Bani Bu Hassan
// Nakhal
// Shinas
// Shinas
// Sohar
// Sur
// Tanam
// Thumrait
// Ibri
// Izz
// Jalan Bani Bu Hassan
// Khaboura
// Liwa
// Madha
// Mahooth
// Manah
// Masirah
// Matrah
// Mudhaybi
// Mudhaybi Al Gharbi
// Mudhaybi Ash Shamali
// Mudhaybi Al Wusta
// Mudhaybi
// Mudhaybi Al Gharbi
// Mudhaybi Ash Shamali
// Mudhaybi Al Wusta
// Mudhaybi Al Janubi
// Mudhaybi Al Sharqi
// Mudhaybi
// Mudhaybi Al Janubi
// Mudhaybi Al Sharqi
// Musannah
// Muscat
// Muttrah
// Nizwa
// Qurayyat
// Raysut
// Rusayl
// Rustaq
// Salalah
// Samail
// Shinas
// Sohar
// Sur
// Tanam
// Thumrait
// Izz
// Jalan Bani Bu Hassan
// Khaboura
// Liwa
// Madha
// Mahooth
// Manah
// Masirah
// Matrah
// Mudhaybi
// Mudhaybi Al Gharbi
// Mudhaybi Ash Shamali
// Mudhaybi Al Wusta
// Mudhaybi
// Mudhaybi Al Gharbi
// Mudhaybi Ash Shamali
// Mudhaybi Al Wusta
// Mudhaybi Al Janubi
// Mudhaybi Al Sharqi
// Mudhaybi
// Mudhaybi Al Janubi
// Mudhaybi Al Sharqi
// Musannah
// Muscat
// Muttrah
// Nizwa
// Qurayyat
// Raysut
// Rusayl
// Rustaq
// Salalah
// Samail
// Shinas
// Sohar
// Sur
// Tanam
// Thumrait