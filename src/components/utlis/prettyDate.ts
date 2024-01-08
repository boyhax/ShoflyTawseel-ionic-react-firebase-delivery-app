import {formatDistanceToNow} from 'date-fns';

import { getLang } from '../../App';
export function prettyDate(date:Date){
  
  let d= formatDistanceToNow(date,{
  //   locale:{code: (getLang()||'en'),
  // formatDistance:(d)=>[]},
  addSuffix:true})
  return d
}