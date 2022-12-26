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