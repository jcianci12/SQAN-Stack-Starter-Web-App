import { FieldValues } from '../models/FieldValues.interface';
export function fetchCache(cacheName: string, fn: Array<string>, id): FieldValues {
  console.log("fetching cache");
  console.log(cacheName, fn, id);
  let a: any;
  //console.log(localStorage.getItem(cacheName));
  a = JSON.parse(localStorage.getItem(cacheName)) as any;
  if (a == null) {
    return null;
    //this.setcache()
  }
  else {

    let friendlyNameString = ""
    fn.forEach(element => {

      if (a[element]) {
        friendlyNameString = friendlyNameString + " " + a[element]
      }
    });

    return {
      friendlyName: friendlyNameString,
      id: a[id]
    };
  }
}
