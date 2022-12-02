import moment from 'moment';
export function prettyDate(date:Date){
  var d 
  d= moment(date).fromNow(true)+" ago";
  return d
}