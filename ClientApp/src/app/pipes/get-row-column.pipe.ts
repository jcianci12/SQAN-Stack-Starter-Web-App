import { Pipe, PipeTransform } from '@angular/core';
import { column } from "../components/controls/column";

@Pipe({
  name: 'getRowColumn'
})
export class GetRowColumnPipe implements PipeTransform {

  transform(row: any, colname: column): any {
    return row[colname.colProp];
  }

}
