export function updatecache(cache: string) {
  localStorage.setItem(cache, null);
  this.fetchCache();
}
