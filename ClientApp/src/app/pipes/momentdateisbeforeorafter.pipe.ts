import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentdateisbeforeorafter'
})
export class MomentdateisbeforeorafterPipe implements PipeTransform {

  transform(a: Date, b: Date, beforeorafter: beforeorafter): unknown {
    switch (beforeorafter) {
      case "isafter": {
        return moment(a).isAfter(b);

      }
      case "isbefore" :{
        return moment(a).isBefore(b);

      }
    }
  }

}
export type beforeorafter = "isbefore" | "isafter"
