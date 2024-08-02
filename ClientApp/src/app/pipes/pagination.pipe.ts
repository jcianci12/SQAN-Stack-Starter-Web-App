import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

  transform(value: Array< any>, pagesize: number, pageindex: number): Array<any> {
    console.log(value,pagesize,pageindex)
    //value - the array
    //
    let startofarray = pagesize * pageindex
    let endofarray = pagesize * pageindex + pagesize
    value = value.slice(startofarray, endofarray)

    return value;
  }

}
