import { fetchCache } from './fetchCache';
export function setcache(cacheName, data) {
  // this.httpClient.getfacilitiesbyterm(this.hiddenfield.value).subscribe(
  //   i => {
  //let p = JSON.stringify(c)
  localStorage.setItem(cacheName, JSON.stringify(data));
  //fetchCache(cacheName, fn, id);
  //   }
  // ).unsubscribe
}
