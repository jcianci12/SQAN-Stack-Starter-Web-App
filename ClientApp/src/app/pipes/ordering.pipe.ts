/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/
import { Pipe, PipeTransform } from '@angular/core';
import { sortBy } from 'lodash';
import { Episode } from '../api/api';
import { areAllEquivalent } from '@angular/compiler/src/output/output_ast';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {

  transform(array: Episode[], sort: SortObject, sortDirection: string): Episode[] {
    console.log("Field is: ", sort.field)
    console.log("Sort order is:", sort.sortDirection)
    if (sort.field == null) {
      return array;
    }
    else {
      switch (sort.sortDirection) {
        case "": {
          return array;
          
        }
        case "asc": {
          array.sort((a: any, b: any) => {

            console.log("a[sort.field])", a[sort.field]);
            
            if (!ts(a[sort.field]).last.localeCompare(ts(b[sort.field]).last)) {
              return ts(a[sort.field].first).localeCompare(ts(b[sort.field].first));
            }
            return ts(a[sort.field].last) .localeCompare(ts( b[sort.field].last));
          });
          return array;
          
        }
        case "desc": {
return []

        }
      }

    }
  }
}

export class SortObject {
  field: string;
  sortDirection: string;
}

function ts(value) {
  console.log("sorting value recieved is:" ,value)
  if (value) {
    return value.toString();
  } else {
    return ""
  }
}